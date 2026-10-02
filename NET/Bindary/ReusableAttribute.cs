using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Componyx.UI.Bindary
{
    /// <summary>
    /// Marks a dispatch target class as safe to cache and reuse across invocations.
    /// Apply only when the class holds no per-call or per-client state.
    /// By default (attribute absent), a new instance is constructed for every call.
    /// </summary>
    [AttributeUsage(AttributeTargets.Class, Inherited = false)]
    public sealed class ReusableAttribute : Attribute
    {
    }
}
