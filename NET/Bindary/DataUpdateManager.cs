using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Componyx.UI.Bindary
{
    /// <summary>
    /// This type is used to manage data events by registering update event actions and subscribing clients to these update events.
    /// </summary>
    public static class DataUpdateManager
    {
        private static ConcurrentDictionary<string, List<Func<Client, object, object, Task>>> _updateEvents = new ConcurrentDictionary<string, List<Func<Client, object, object, Task>>>();
        private static ConcurrentDictionary<string, List<Subscription>> _subscriptions = new ConcurrentDictionary<string, List<Subscription>>();

        /// <summary>
        /// Adds an update action for the specified Update and/or Group id. At least one of the id's must be provided.
        /// </summary>
        /// <param name="updateId">The identifier of the update event.</param>
        /// <param name="action">The action to call when the update event fires.</param>
        /// <param name="groupId">The group to which the update belongs.</param>
        public static void AddUpdateAction(string updateId, Func<Client, object, object, Task> action, string groupId = "")
        {
            updateId = FormatUpdateId(updateId, groupId);

            if (!_updateEvents.ContainsKey(updateId))
                _updateEvents.TryAdd(updateId, new List<Func<Client, object, object, Task>>());

            _updateEvents[updateId].Add(action);
        }

        /// <summary>
        /// Returns the subscribed clients for the specified update event.
        /// </summary>
        /// <param name="updateId">The identifier of the update event.</param>
        /// <param name="groupId">The group to which the update belongs.</param>
        /// <returns>List of clients.</returns>
        public static List<Subscription> Subscriptions(string updateId, string groupId = "")
        {
            updateId = FormatUpdateId(updateId, groupId);
            return _subscriptions[updateId];
        }

        /// <summary>
        /// Subscribes a client for an update event.
        /// </summary>
        /// <param name="updateId">The identifier of the update event.</param>
        /// <param name="client">The client.</param>
        /// <param name="groupId">The group to which the update belongs.</param>
        /// <param name="args">Arguments to bind to the subscription.</param>
        public static void Subscribe(string updateId, Client client, string groupId = "", object args = null)
        {
            if (!_subscriptions.ContainsKey(FormatUpdateId(updateId, groupId)))
                _subscriptions.TryAdd(FormatUpdateId(updateId, groupId), new List<Subscription>());

            if (!HasSubscription(updateId, client, groupId))
                _subscriptions[FormatUpdateId(updateId, groupId)].Add(new Subscription(client, args));
        }

        /// <summary>
        /// Removes all client subscriptions.
        /// </summary>
        public static void ClearSubscriptions()
        {
            _subscriptions = new ConcurrentDictionary<string, List<Subscription>>();
        }

        /// <summary>
        /// Removes all client subscriptions for the specified update event.
        /// </summary>
        /// <param name="updateId">The identifier of the update event.</param>
        /// <param name="groupId">The group to which the update belongs.</param>
        /// <param name="startsWithSearch">A value indicating if subscriptions which start with the specified update identifier are removed.</param>
        public static void Unsubscribe(string updateId, string groupId = "", bool startsWithSearch = true)
        {
            updateId = FormatUpdateId(updateId, groupId);

            if (!startsWithSearch)
                _subscriptions.TryRemove(updateId, out List<Subscription> removed);
            else
            {
                var toRemove = _subscriptions.Where(pair => pair.Key.StartsWith(updateId))
                             .Select(pair => pair.Key)
                             .ToList();

                foreach (var key in toRemove)
                {
                    _subscriptions.TryRemove(key, out List<Subscription> removed);
                }
            }
        }

        /// <summary>
        /// Removes all subscriptions of the specified client.
        /// </summary>
        /// <param name="client">The client.</param>
        /// <param name="groupId">The group for which the client subscriptions must be removed.</param>
        public static void Unsubscribe(Client client, string groupId = "")
        {
            IEnumerable<KeyValuePair<string, List<Subscription>>> subscriptions = (groupId == "") ? _subscriptions : _subscriptions.Where(x => x.Key.StartsWith(groupId + "#"));

            foreach (KeyValuePair<string, List<Subscription>> kvp in subscriptions)
            {
                kvp.Value.RemoveAll(x => x.Client.Id.Equals(client.Id));
            }
        }

        /// <summary>
        /// Removes the client subscription for the specified update event.
        /// </summary>
        /// <param name="updateId">The identifier of the update event.</param>
        /// <param name="client">The client.</param>
        /// <param name="groupId">The group to which the update belongs.</param>
        /// <param name="startsWithSearch">A value indicating if subscriptions of the specified client which start with the specified update identifier are removed.</param>
        public static void Unsubscribe(string updateId, Client client, string groupId = "", bool startsWithSearch = true)
        {
            if (!startsWithSearch)
            {
                if (!_subscriptions.ContainsKey(FormatUpdateId(updateId, groupId)) || !HasSubscription(updateId, client, groupId))
                    return;

                _subscriptions[FormatUpdateId(updateId, groupId)].RemoveAll(x => x.Client.Id.Equals(client.Id));
            }
            else
            {
                int index;
                var toRemove = _subscriptions.Where(pair => pair.Key.StartsWith(FormatUpdateId(updateId, groupId)))
                                             .Select(pair => pair.Key)
                                             .ToList();

                foreach (var key in toRemove)
                {
                    index = key.IndexOf(groupId + "#");

                    if ((groupId == "" && HasSubscription(key, client)) || (index > -1 && HasSubscription(key.Substring(groupId.Length + 1), client, groupId)))
                        _subscriptions[key].RemoveAll(x => x.Client.Id.Equals(client.Id));
                }
            }
        }

        /// <summary>
        /// Checks if the client is subscribed to the specified update event.
        /// </summary>
        /// <param name="updateId">The identifier of the update event.</param>
        /// <param name="client">The client.</param>
        /// <param name="groupId">The group to which the update belongs.</param>
        /// <returns>A boolean value indicating if the client is subscribed to the specified update event.</returns>
        public static bool HasSubscription(string updateId, Client client, string groupId = "")
        {
            updateId = FormatUpdateId(updateId, groupId);

            if (!_subscriptions.ContainsKey(updateId))
                return false;

            var obj = _subscriptions[updateId];

            lock(obj)
            {
                obj.RemoveAll(x => x == null || x.Client == null); // bug fix: clear null values to avoid weird null reference exception
                return (obj.FindIndex(x => x.Client.Id.Equals(client.Id)) > -1);
            }            
        }

        /// <summary>
        /// Returns the client subscription for the specified update event.
        /// </summary>
        /// <param name="updateId">The identifier of the update event.</param>
        /// <param name="client">The client.</param>
        /// <param name="groupId">The group to which the update belongs.</param>
        /// <returns>The subscription for the specified update event and client.</returns>
        public static Subscription GetSubscription(string updateId, Client client, string groupId = "")
        {
            updateId = FormatUpdateId(updateId, groupId);

            if (!_subscriptions.ContainsKey(updateId))
                return null;

            var index = _subscriptions[updateId].FindIndex(x => x.Client.Id.Equals(client.Id));

            if (index > -1)
                return _subscriptions[updateId][index];
            else
            {
                Unsubscribe(updateId, client, groupId);
                return null;
            }
        }

        /// <summary>
        /// Invokes all update event actions for all subscribers.
        /// </summary>
        /// <param name="groupId">The group to which the update belongs.</param>
        /// <param name="args">An object to pass as second argument to the action method.</param>
        public static async Task Update(string groupId = "", object args = null)
        {
            foreach (string updateId in _subscriptions.Keys.Where(x => x.StartsWith(groupId + "#")).ToList())
            {
                await Update(updateId, groupId, args).ConfigureAwait(false);
            }
        }

        /// <summary>
        /// Invokes the specified update event actions for all subscribers.
        /// </summary>
        /// <param name="updateId">The identifier of the update event.</param>
        /// <param name="groupId">The group to which the update belongs.</param>
        /// <param name="args">An object to pass as second argument to the action method.</param>
        public static async Task Update(string updateId, string groupId = "", object args = null)
        {
            if (!_subscriptions.ContainsKey(FormatUpdateId(updateId, groupId)))
                return;

            foreach (var s in _subscriptions[FormatUpdateId(updateId, groupId)].ToList())
            {
                await Update(updateId, s.Client, groupId, s.Args, args).ConfigureAwait(false);
            }
        }

        /// <summary>
        /// Calls all update event actions for the specified subscriber.
        /// </summary>
        /// <param name="client">The client.</param>
        /// <param name="groupId">The group to which the update belongs.</param>
        /// <param name="args">An object to pass as second argument to the action method.</param>
        public static async Task Update(Client client, string groupId = "", object args = null)
        {
            IEnumerable<KeyValuePair<string, List<Subscription>>> subscriptions = (groupId == "") ? _subscriptions : _subscriptions.Where(x => x.Key.StartsWith(groupId + "#"));

            foreach (KeyValuePair<string, List<Subscription>> kvp in subscriptions.ToList())
            {
                foreach (var v in kvp.Value.FindAll(s => s.Client.Id.Equals(client.Id)).ToList())
                {
                    await Update(kvp.Key, client, groupId, v.Args, args).ConfigureAwait(false);
                }
            }
        }

        /// <summary>
        /// Invokes the specified update event for the specified subscriber. 
        /// </summary>
        /// <param name="updateId">The identifier of the update event.</param>
        /// <param name="client">The client.</param>
        /// <param name="groupId">The group to which the update belongs.</param>
        /// <param name="args">An object to pass as second argument to the action method.</param>
        public static async Task Update(string updateId, Client client, string groupId = "", object args = null)
        {
            Subscription subscription = GetSubscription(updateId, client, groupId);

            if ((!_updateEvents.ContainsKey(FormatUpdateId(updateId, groupId)) && !_updateEvents.ContainsKey(groupId + "#")) || subscription == null)
                return;

            await Update(updateId, client, groupId, subscription.Args, args).ConfigureAwait(false);
        }

        private static async Task Update(string updateId, Client client, string groupId = "", object subscriptionArgs = null, object updateArgs = null)
        {
            updateId = FormatUpdateId(updateId, groupId);
            var groupList = (_updateEvents.ContainsKey(groupId + "#")) ? _updateEvents[groupId + "#"] : new List<Func<Client, object, object, Task>>();
            var list = (_updateEvents.ContainsKey(updateId)) ? _updateEvents[updateId] : new List<Func<Client, object, object, Task>>();

            foreach (var a in groupList.Concat(list))
            {
                await a.Invoke(client, subscriptionArgs, updateArgs).ConfigureAwait(false);
            }
        }

        private static string FormatUpdateId(string updateId, string groupId = "")
        {
            return groupId + "#" + updateId;
        }
    }


    /// <summary>
    /// Represents a single client's subscription to an update event, along with any
    /// arguments bound to that subscription.
    /// </summary>
    public class Subscription
    {
        /// <summary>
        /// Gets or sets the subscribed client.
        /// </summary>
        public Client Client { get; set; }

        /// <summary>
        /// Gets or sets the arguments bound to the subscription.
        /// </summary>
        public object Args { get; set; }

        /// <summary>
        /// Initializes a new subscription for the specified client.
        /// </summary>
        /// <param name="client">The subscribing client.</param>
        /// <param name="args">Arguments to bind to the subscription.</param>
        public Subscription(Client client, object args = null)
        {
            this.Client = client;
            this.Args = args;
        }
    }
}
