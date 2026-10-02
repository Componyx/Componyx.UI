/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";
(function (window)
{
    /**
    * AppSkin class.
    * @class
    * @memberof componyx.UI
    * @augments componyx.UI.base.Component
    * @mixes componyx.UI.base.methods
    * @param {String} id The id of the component.
    * @param {Object|HTMLElement} properties The properties used to initialize the component or the container element.
    * @property {componyx.UI.base.AjaxMethod} ajax.authenticate - AJAX method used to authenticate.
    * @property {componyx.UI.base.AjaxMethod} ajax.search - AJAX method used to load search results.
    * @returns {componyx.UI.AppSkin} An instance of the component.
    */
    componyx.UI.AppSkin = function AppSkin(id, properties)
    {
        window.$appskin = this;

        // define private properties
        let _instance = this,
            _screenOption = componyx.UI.AppSkin.ScreenOption,
            _menuTypeOption = componyx.UI.AppSkin.MenuTypeOption,
            _footerDisplayOption = componyx.UI.AppSkin.FooterDisplayOption,
            _menuSectionOption = componyx.UI.AppSkin.MenuSectionOption,
            _routePathMatchingOption = componyx.UI.AppSkin.RoutePathMatchingOption,
            _failureReasonOption = componyx.UI.AppSkin.FailureReasonOption,
            _tileSizeOption = componyx.UI.AppSkin.TileSizeOption,
            _menuButton, _login, _loginVerification, _topbar, _page, _header, _footer, _sideMenuBox, _mainMenu, _headerMenu, _footerMenu, _quickLaunchMenu, _searchBox, _searchResult,
            _user, _pass, _remember, _loginFailedMessage, _verificationFailedMessage, _verificationCode, _activeScreen, _view, _error, _overlay, _allInHeader = true, _errorData,
            _preloader, _launch = true, _resizeTimerId, _headerOverflowTimerId, _searchTimerId, _windowWidth, _classOption;

        /**
         * Internal CSS class name constants.
         * You can override any of these classes on the Component instance by defining a property named
         * `cssClass<Key>` where <Key> is the PascalCase key from this object.
         * Example:
         *  'SEARCH_RESULT' -> 'cssClassSearchResult'
         * Be cautious: overriding these classes without including the default names may break styling and functionality.
         * @constant
         * @type {Readonly<Object<string, string>>}
         */
        this.classOption = Object.freeze(
            {
                FULL: 'full',
                ERROR: 'error',
                TOPBAR: 'topbar',
                FOOTER: 'footer',
                REQUIRED: 'required',
                MENU_LEFT: 'menu-left',
                AUTHENTICATED: 'authenticated',
                SEARCH_ACTIVE: 'search-active',
                PORTAL_MENU: 'portal-menu',
                SIDE_MENU: 'side-menu',
                LOGIN: 'login',
                VERIFICATION: 'verification',
                HEADER_ALL: 'header-all',
                HEADER_MENU_HIDDEN: 'header-menu-hidden',
                HEADER_OVERFLOW: 'header-overflow',
                BODY: 'body',
                PAGE: 'page',
                VIEW: 'view',
                OVERLAY: 'overlay',
                SIDEBAR: 'sidebar',
                APP_CONTENT: 'app-content',
                SEARCH: 'search',
                SEARCH_RESULT: 'search-result',
                SPINNER: 'spinner',
                BOX: 'box',
                PRELOADER: 'preloader',
                MENU: 'menu',
                MAIN: 'main',
                SIDE: 'side',
                PORTAL: 'portal',
                HEADER_MENU: 'header-menu',
                QUICK_LAUNCH: 'quick-launch',
                FOOTER_MENU: 'footer-menu',
                BUTTON: 'button',
                MENU_BUTTON: 'menu-button',
                ACCOUNT: 'account',
                ACCOUNT_AVATAR: 'account-avatar',
                NO_ACTION: 'no-action',
                SUB_GROUP: 'sub-group',
                ROW_START: 'row-start',
                SHADE: 'shade',
                LOGIN_SCREEN: 'login-screen',
                LOGIN_VERIFICATION: 'login-verification',
                CONTENT: 'content',
                USER: 'user',
                PASS: 'pass',
                REMEMBER: 'remember',
                CODE: 'code',
                MESSAGE: 'message',
                ICON_MENU: 'ico-menu ico-m',
                ICON_USER: 'ico-user',
                ICON_LOCK: 'ico-lock',
                ICON_KEY: 'ico-key',
                ICON_EYE: 'ico-eye',
                ICON_EYE_BLOCKED: 'ico-eye-blocked'
            });

        /**
         * Gets the css class if it exists and otherwise the default css class.
         * @param {String} cssClassValue The default css class (a value of the classOption object).
         * @returns {String} The css class.
         */
        this.getCssClass = function (cssClassValue)
        {
            return $base.methods.getCssClass.call(_instance, _instance.classOption, cssClassValue);
        }

        // define public properties
        /**
         * Gets or sets a value indicating if authentication is required.
         * @type {Boolean}
         */
        this.authenticationRequired = true;

        /**
         * Gets a value indicating if the user is authenticated.
         * @type {Boolean}
         */
        this.authenticated = false;

        /**
         * Gets a value indicating if the menu is displayed on app launch.
         * @type {Boolean}
         */
        this.launchMenu = true;

        /**
         * Gets a value indicating if the menu button is displayed when the app-skin login page is active.
         * @type { Boolean }
        */
        this.hideMenuButtonOnLogin = false;

        /**
         * Gets or sets a value indicating if the contents of the app skin will utilize the full-screen width.
         * @type {Boolean}
         */
        this.fullscreen = false;

        /**
         * Gets or sets a value indicating if the page content utilizes the full-screen width when not in full-screen mode.
         * @type {Boolean}
         */
        this.fullpage = false;

        /**
         * Gets or sets a value indicating if the rememeber me option is available for manual login.
         * @type {Boolean}
         */
        this.showRememberMe = false;

        /**
         * Gets or sets a value indicating if the top-bar in the header is always visible (true) or is hidden when the portal-menu is active (false).
         * @type {Boolean}
         */
        this.persistentTopBar = false;

        /**
         * Gets or sets a value indicating if the menu button is always visible (true) or is hidden when the all menu-items are visible in the header-menu.
         * @type {Boolean}
         */
        this.persistentMenuButton = false;

        /**
         * Gets or sets a value indicating if the side-menu displays at the right side (false) or the left side (true) of the screen.
         * @type {Boolean}
         */
        this.menuLeft = false;

        /**
         * Gets or sets a value indicating if the account button is displayed as avatar when the user is authenticated.
         * @type {Boolean}
         */
        this.accountButtonAvatar = false;

        /**
         * Gets or sets a value indicating if the login template is created when rendering the app skin.
         * @type {Boolean}
         */
        this.useLoginTemplate = true;

        /**
         * Gets or sets a value indicating if the Bindary framework is used for loading routes.
         * @type {Boolean}
         */
        this.useBindary = true;

        /**
         * Gets or sets the menu navigation type (portal-menu or side-menu).
         * @type {componyx.UI.AppSkin.MenuTypeOption}
         */
        this.menuType = _menuTypeOption.PORTALMENU;

        /**
         * Gets or sets a value indicating if menu-items are automatically selected if the item's route-path (partially) matches the current URL route-path.
         * @type {componyx.UI.AppSkin.RoutePathMatchingOption}
         */
        this.menuRoutePathMatching = _routePathMatchingOption.PARTIAL;

        /**
         * Gets or sets a value indicating when the footer is displayed.
         * @type {componyx.UI.AppSkin.FooterDisplayOption}
         */
        this.footerDisplay = _footerDisplayOption.MENU;

        /**
         * Gets or sets the delay in milliseconds before the typed letter(s) in the search-box are sent to the server.
         * @type {Number}
         */
        this.searchDelay = 100;

        /**
         * Gets or sets the search-box placeholder label.
         * @type {String}
         */
        this.searchLabel = 'Search';

        /**
         * Gets or sets the label when no search results are found.
         * @type {String}
         */
        this.searchNoResultLabel = 'No results found.';

        /**
         * Gets or sets the category labels for the search-results. Use empty string key for root label.
         * @type {Object}
         */
        this.searchCategoryLabels = {};

        /**
         * Gets or sets the action of the account button.
         * @type {Function|String}
         */
        this.accountAction = null;

        /**
         * Gets or sets the account button avatar initials.
         * @type {String}
         */
        this.avatarInitials = '';

        /**
         * Gets or sets the account button avatar image path.
         * @type {String}
         */
        this.avatarImagePath = '';

        /**
         * Gets or sets the Loading text label.
         * @type {String}
         */
        this.loadingLabel = 'Loading...';

        /**
         * Gets or sets the text label of the main category.
         * @type {String}
         */
        this.mainCategoryLabel = '';

        /**
         * Gets or sets the username of the authenticated user.
         * @type {String}
         */
        this.username = 'Not logged in';

        /**
         * Gets or sets the Username text label.
         * @type {String}
         */
        this.usernameLabel = 'USERNAME';

        /**
         * Gets or sets the Password text label.
         * @type {String}
         */
        this.passwordLabel = 'PASSWORD';

        /**
         * Gets or sets the RememberMe text label.
         * @type {String}
         */
        this.rememberMeLabel = 'Remember me';

        /**
         * Gets or sets the text label of the login button.
         * @type {String}
         */
        this.loginButtonLabel = 'LOGIN';

        /**
         * Gets or sets the default label for an authentication failure.
         * @type {String}
         */
        this.authenticationFailureLabel = 'Authentication failed';

        /**
         * Gets or sets the labels for the authentication failure reasons.
         * @type {String[]}
         */
        this.authenticationFailureReasonLabels = [
            'CRSF-Token mismatch.',
            'Maximum sign-in attempts exceeded.',
            'Username and/or parssword is incorrect.',
            'Verification code is incorrect.',
            'The verification code has expired.',
            'Maximum verification attempts exceeded.',
            'Authentication failed.'
        ];

        /**
         * Gets or sets the text label of the login-verification button.
         * @type {String}
         */
        this.verificationButtonLabel = 'VERIFY';

        /**
         * Gets or sets the text label of the login verification code.
         * @type {String}
         */
        this.verificationCodeLabel = 'Verification Code';

        /**
         * Gets or sets the input field length of the login verification code.
         * @type {Number}
         */
        this.verificationCodeLength = 6;

        /**
         * Gets or sets the delay in milliseconds before the app is reloaded when the login verification failed.
         * @type {Number}
         */
        this.verificationFailedReloadDelay = 5000;

        /**
         * Gets or sets the CRSF Token to send with autorisation POST actions.
         * @type {String|null}
         */
        this.crsfToken = null;

        /**
         * Gets or sets the list of menu-items.
         * @type {componyx.UI.AppSkin.MenuItem[]}
         */
        this.menu = [];

        /**
         * Gets or sets the id of the menu component used as base for the main menu.
         * @type {String|null}
         */
        this.mainMenuId = null;

        /**
         * Gets or sets the id of the menu component used as base for the header menu.
         * @type {String|null}
         */
        this.headerMenuId = null;

        /**
         * Gets or sets the id of the menu component used as base for the footer menu.
         * @type {String|null}
         */
        this.footerMenuId = null;

        /**
         * Gets or sets the id of the menu component used as base for the quick launch menu.
         * @type {String|null}
         */
        this.quickLaunchMenuId = null;

        /**
         * Gets or sets the id of the button component used as base for the menu button.
         * @type {String|null}
         */
        this.menuButtonId = null;

        /**
         * Gets or sets the id of the button component used as base for the login button.
         * @type {String|null}
         */
        this.loginButtonId = null;

        /**
         * Gets or sets the id of the button component used as base for the login-verification button.
         * @type {String|null}
         */
        this.verificationButtonId = null;

        /**
         * Gets or sets the id of the button component used as base for the account button.
         * @type {String|null}
         */
        this.accountButtonId = null;

        /**
         * Gets or sets the id of the form-field component used as base for the username form field.
         * @type {String|null}
         */
        this.usernameFormFieldId = null;

        /**
         * Gets or sets the id of the form-field component used as base for the password form field.
         * @type {String|null}
         */
        this.passwordFormFieldId = null;

        /**
         * Gets or sets the id of the form-field component used as base for the remember-me form field.
         * @type {String|null}
         */
        this.rememberMeFormFieldId = null;

        /**
         * Gets or sets the id of the form-field component used as base for the verification code form field.
         * @type {String|null}
         */
        this.verificationCodeFormFieldId = null;

        /**
        * @typedef {Object} AuthenticationResponseEventArgs
        * @memberof componyx.UI.AppSkin
        * @property {AuthenticationStateOption} authenticationState     - The authentication state.
        * @property {FailureReasonOption} failureReason				    - The reason why the authentication attempt failed.
        * @property {String} failureMessage							    - The failure message.
        * @property {Boolean} [cancel=false]						    - A value indicating if the default action of the AppSkin component should be canceled.
        */

        /**
        * @typedef {Object} ResizeActionEventArgs
        * @memberof componyx.UI.AppSkin
        * @property {Boolean} headerOverflow						    - A value indicating if the content in the header caused an overflow.
        * @property {Boolean} [cancel=false]						    - A value indicating if the default action of the AppSkin component should be canceled.
         */

        /**
        * @typedef {Object} SearchResultsEventArgs
        * @memberof componyx.UI.AppSkin
        * @property {Array<Object>} data						        - The search results.
        * @property {HTMLElement} container						        - The search results container element.
        * @property {Boolean} [cancel=false]						    - A value indicating if the default action of the AppSkin component should be canceled.
        */

        /**
        * @typedef {Object} SearchResultEventArgs
        * @memberof componyx.UI.AppSkin
        * @property {Array<Object>} data						        - The search results.
        * @property {HTMLElement} container						        - The search results container element.
        * @property {HTMLElement} [anchor]						        - The seach result element.
        * @property {Object} [item]						                - The seach result item.
        */

        /**
         * @class
         * @augments componyx.UI.base.Events
         * @memberof componyx.UI.AppSkin
         * @property {componyx.UI.base.Event} onShowLogin                          - Event which fires when the login-screen is shown.
         * @property {componyx.UI.base.Event} onShowLoginVerification              - Event which fires when the login-verification-screen is shown.
         * @property {componyx.UI.base.Event} onShowPage                           - Event which fires when the page-screen is shown.
         * @property {componyx.UI.base.Event} onShowError                          - Event which fires when the error-screen is shown.
         * @property {componyx.UI.base.Event} onShowMenu                           - Event which fires when the menu is shown.
         * @property {componyx.UI.base.Event} onHideMenu                           - Event which fires when the menu is hidden.
         * @property {componyx.UI.base.Event} onLoginAttempt                       - Event which fires when a login attempt is made. @see {@link componyx.UI.AppSkin.AuthenticationResponseEventArgs}
         * @property {componyx.UI.base.Event} onLoginVerificationAttempt           - Event which fires when a login verification attempt is made. @see {@link componyx.UI.AppSkin.AuthenticationResponseEventArgs}
         * @property {componyx.UI.base.Event} onLogout                             - Event which fires when the user logged out. @see {@link componyx.UI.AppSkin.AuthenticationResponseEventArgs}
         * @property {componyx.UI.base.Event} onPreSearchResults                   - Event which fires before the search results are rendered. @see {@link componyx.UI.AppSkin.SearchResultsEventArgs}
         * @property {componyx.UI.base.Event} onRenderSearchResult                 - Event which fires when a search result link is rendered. @see {@link componyx.UI.AppSkin.SearchResultEventArgs}
         * @property {componyx.UI.base.Event} onPostSearchResults                  - Event which fires after the search results are rendered. @see {@link componyx.UI.AppSkin.SearchResultsEventArgs}
         * @property {componyx.UI.base.Event} onResize                             - Event which fires when the window is resized. @see {@link componyx.UI.AppSkin.ResizeActionEventArgs}
         * @see {@link componyx.UI.base.Events}
         */
        function AppSkinEvents(events)
        {
            Object.assign(this, events);

            this.onShowLogin = $base.static.createEvent('onShowLogin');
            this.onShowLoginVerification = $base.static.createEvent('onShowLoginVerification');
            this.onShowPage = $base.static.createEvent('onShowPage');
            this.onShowError = $base.static.createEvent('onShowError');
            this.onShowMenu = $base.static.createEvent('onShowMenu');
            this.onHideMenu = $base.static.createEvent('onHideMenu');
            this.onLoginAttempt = $base.static.createEvent('onLoginAttempt');
            this.onLoginVerificationAttempt = $base.static.createEvent('onLoginVerificationAttempt');
            this.onLogout = $base.static.createEvent('onLogout');
            this.onPreSearchResults = $base.static.createEvent('onPreSearchResults');
            this.onRenderSearchResult = $base.static.createEvent('onRenderSearchResult');
            this.onPostSearchResults = $base.static.createEvent('onPostSearchResults');
            this.onResize = $base.static.createEvent('onResize');
        };

        /**
         * AppSkin events
         * @type {componyx.UI.AppSkin.AppSkinEvents} 
         */
        this.events = new AppSkinEvents(this.events);

        // inherit base instance members
        $base.Component.apply(this, [id, properties]);
        _classOption = this.classOption;

        // define ajax methods
        this.ajax.addMethod('authenticate');
        this.ajax.addMethod('search');

        /** 
        * Sets the header template. This template supports the below listed interpolations. Default value: {logo}{quickLaunchMenu}{menuButton}{topbar}{menu}{/topbar}
        * - {topbar} This value will be replaced with the opening topbar element tag.
        * - {/topbar} This value will be replaced with the closing topbar element tag.
        * - {logo} This value will be replaced with the figure element.
        * - {menuButton} This value will be replaced with the menu button.
        * - {accountButton} When authenticated this value will be replaced with the account button otherwise it will open the login screen.
        * - {menu} This value will be replaced with the header menu, containing all menu-items with menuSection set to either MAIN_HEADER or HEADER.
        * - {quickLaunchMenu} This value will be replaced with the quick-launch menu, containing all menu-items with menuSection set to QUICKLAUNCH
        * - {username} This value will be replaced with the username of the logged in user.
        * - {searchBox} This value will be replaced with the search-box.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        this.setHeaderTemplate = function (content)
        {
            _instance.addTemplate('Header', content, false);
        }

        /** 
        * Sets the footer template. This template supports the below listed interpolations. Default value: {menu}{username}{loginButton}
        * - {logo} This value will be replaced with the figure element.
        * - {accountButton} When authenticated this value will be replaced with the account button otherwise it will open the login screen.
        * - {menu} This value will be replaced with the footer menu, containing all menu-items with menuSection set to FOOTER.
        * - {quickLaunchMenu} This value will be replaced with the quick-launch menu, containing all menu-items with menuSection set to QUICKLAUNCH
        * - {username} This value will be replaced with the username of the logged in user.
        * - {searchBox} This value will be replaced with the search-box.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        this.setFooterTemplate = function (content)
        {
            _instance.addTemplate('Footer', content, false);
        }

        /** 
        * Sets the sidebar template. This template supports the below listed interpolations.
        * - {logo} This value will be replaced with the figure element.
        * - {menuButton} This value will be replaced with the menu button.
        * - {accountButton} When authenticated this value will be replaced with the account button otherwise it will open the login screen.
        * - {quickLaunchMenu} This value will be replaced with the quick-launch menu, containing all menu-items with menuSection set to QUICKLAUNCH
        * - {username} This value will be replaced with the username of the logged in user.
        * - {searchBox} This value will be replaced with the search-box.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        this.setSidebarTemplate = function (content)
        {
            _instance.addTemplate('SidebarLeft', content, false);
        }

        /** 
        * Sets the login template. This template supports the below listed interpolations. Default value: {logo}{username}{password}{rememberMe}{loginButton}{failedMessage}
        * - {logo} This value will be replaced with the figure element.
        * - {username} This value will be replaced with the username input field.
        * - {password} This value will be replaced with the password input field.
        * - {rememberMe} This value will be replaced with the remember-me checkbox.
        * - {loginButton} This value will be replaced with the login button.
        * - {failedMessage} This value will be replaced with the message displayed when a login attempt failed.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        this.setLoginTemplate = function (content)
        {
            _instance.addTemplate('Login', content, false);
        }

        /** 
        * Sets the login verification template. This template supports the below listed interpolations. Default value: {logo}{verificationCode}{verificationButton}{failedMessage}
        * - {logo} This value will be replaced with the figure element.
        * - {verificationCode} This value will be replaced with the verification-code input field.
        * - {verificationButton} This value will be replaced with the verification button.
        * - {failedMessage} This value will be replaced with the message displayed when a verification attempt failed.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        this.setLoginVerificationTemplate = function (content)
        {
            _instance.addTemplate('LoginVerification', content, false);
        }

        /** 
        * Sets the error template. The error template supports the below listed interpolations.
        * - {message} This value will be replaced with the error message.
        * - {timestamp} This value will be replaced with the error timestamp (optional).
        * - {id} This value will be replaced with the error identifier (optional).
        * - {stackTrace} This value will be replaced with the error stack trace (optional).
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        this.setErrorTemplate = function (content)
        {
            _instance.addTemplate('Error', content, false);
        }

        /** 
        * Sets the not found template, shown when the requested page does not exist: no route matches the URL, or the page request returns 404 or 410. The not found template supports the below listed interpolations.
        * - {status} This value will be replaced with the HTTP status of the page request, when there was one (optional).
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        this.setNotFoundTemplate = function (content)
        {
            _instance.addTemplate('NotFound', content, false);
        }

        /** 
        * Sets the page header template.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        this.setPageHeaderTemplate = function (content)
        {
            _instance.addTemplate('PageHeader', content, false);
        }

        /** 
        * Sets the page footer template.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The HTML template.
        */
        this.setPageFooterTemplate = function (content)
        {
            _instance.addTemplate('PageFooter', content, false);
        }

        /** 
        * Sets a value indicating if the app skin utilizes the full width of the screen.
        * @param {Boolean} value A value indicating if the appskin utilizes the full width of the screen.
        */
        this.setFullscreen = function (value)
        {
            if (value)
                $lib.addClass(_instance.element, _instance.getCssClass(_classOption.FULL));
            else
                $lib.removeClass(_instance.element, _instance.getCssClass(_classOption.FULL));
        }

        /** 
        * Sets a value indicating if the page content utilizes the full-screen width when not in full-screen mode.
        * @param {Boolean} value A value indicating if the page content container utilizes the full width of the screen.
        */
        this.setFullpage = function (value)
        {
            if (value)
                $lib.addClass(_view.firstChild, _instance.getCssClass(_classOption.FULL));
            else
                $lib.removeClass(_view.firstChild, _instance.getCssClass(_classOption.FULL));
        }

        /** 
        * Shows the intial page based upon the defined properties.
        */
        this.launch = function ()
        {
            launch();
        }

        /** 
        * Updates the menu state to the active route path. The corresponding menu items are selected / expanded based on the menuRoutePathMatching setting.
        * @param {String} routePath The active route path. The route path may end with a page anchor.
        * @param {String} [hashtagRoutes] A value indicating if hashtag routes are used, in other words, the route-path follows the first hashtag.
        */
        this.updateMenuState = function (routePath, hashtagRoutes)
        {
            updateMenuState(routePath, hashtagRoutes);
        }

        /** 
        * Gets the active screen.
        * @returns {componyx.UI.AppSkin.ScreenOption} The active screen.
        */
        this.activeScreen = function ()
        {
            return _activeScreen;
        }

        /** 
        * Gets the main menu.
        * @returns {componyx.UI.Menu} The main menu component.
        */
        this.getMainMenu = function ()
        {
            return _mainMenu;
        }

        /** 
        * Gets the header menu.
        * @returns {componyx.UI.Menu} The header menu component.
        */
        this.getHeaderMenu = function ()
        {
            return _headerMenu;
        }

        /** 
        * Gets the footer menu.
        * @returns {componyx.UI.Menu} The footer menu component.
        */
        this.getFooterMenu = function ()
        {
            return _footerMenu;
        }

        /** 
        * Gets the quick-launch menu.
        * @returns {componyx.UI.Menu} The quick-launch menu component.
        */
        this.getQuickLaunchMenu = function ()
        {
            return _quickLaunchMenu;
        }

        /** 
        * Gets the preloader.
        * @returns {componyx.UI.Box} The preloader box component.
        */
        this.preloader = function ()
        {
            return _preloader;
        }

        /** 
        * Shows the login page.
        */
        this.showLogin = function ()
        {
            showLogin();
        }

        /** 
        * Shows the login verification page.
        */
        this.showLoginVerification = function ()
        {
            showLoginVerification();
        }

        /** 
        * Toggles the display of the main menu.
        */
        this.toggleMenu = function ()
        {
            toggleMenu();
        }

        /** 
        * Shows the main menu.
        * @param {Boolean} [instant] A value indicating if the menu should be shown instantly without animation. Only applicable for side menu.
        */
        this.showMenu = function (instant)
        {
            showMenu(instant);
        }

        /** 
        * Hides the main menu.
        * @param {Boolean} [instant] A value indicating if the menu should be shown instantly without animation. Only applicable for side menu.
        */
        this.hideMenu = function (instant)
        {
            hideMenu(instant);
        }

        /** 
        * Processes the header overflow tasks.
        */
        this.checkHeaderOverflow = function ()
        {
            checkHeaderOverflow(null);
        }

        /** 
        * Shows the page.
        * @param {Boolean} hideError Hides the error screen if active.
        */
        this.showPage = function (hideError)
        {
            if (_launch && _instance.launchMenu && _instance.menuType == _menuTypeOption.PORTALMENU)
                return;

            let errorShowing = _error.style.display != 'none';
            hideAll();
            updateMenuButtonVisibility();
            _page.style.display = '';

            if (!errorShowing || hideError)
            {
                $lib.removeClass(_instance.element, _instance.getCssClass(_classOption.ERROR));
                _error.style.display = 'none';
                _view.style.display = '';
            }

            document.documentElement.style.overflow = "";

            if (_topbar)
            {
                _topbar.style.display = '';
                $lib.addClass(_instance.element, _instance.getCssClass(_classOption.TOPBAR));
            }

            _instance.events.onShowPage.fire(_instance);
        }

        /** 
        * Checks if the error screen is active.
        * @returns {Boolean} A value indicating if an error occurred.
        */
        this.hasError = function ()
        {
            return (_error.style.display != 'none');
        }

        /** 
        * Initiates a search request.
        * @param {String} terms The search terms. 
        */
        this.search = function (terms)
        {
            search(terms);
        }

        /** 
        * Log's the user in.
        * @param {Object} [settings] The login settings to send to the authentication handler. By default input values (string username, string password, boolean persistent) from the login-screen are sent to the authentication handler.
        */
        this.login = function (settings)
        {
            login(settings);
        }

        /** 
        * Verifies the login verification code.
        * @param {Object} [settings] The login settings to send to the authentication handler. By default the input value (string verificationCode) from the login-verification-screen is sent to the authentication handler.
        */
        this.verifyCode = function (settings)
        {
            verifyCode(settings);
        }

        /** 
        * Log's the user out.
        * @param {Object} [settings] The logout settings to send to the authentication handler. By default boolean logout:true is sent to the authentication handler.
        */
        this.logout = function (settings)
        {
            logout(settings);
        }

        /** 
        * Renders the component
        */
        this.render = async function ()
        {
            if (_instance.renderState != $base.static.RenderState.RENDERING)
            {
                // call base render and return
                $base.methods.render.call(_instance, preRender, 'app-skin');
                return;
            }

            if (componyx.UI.menu_modules)
                await componyx.UI.menu_modules.loaded; // we wait before the menu and it's modules are loaded

            // render logic after loading resources
            if (!_instance.hasTemplate('Header'))
                _instance.addTemplate('Header', '{logo}{quickLaunchMenu}{searchBox}{menuButton}{topbar}{menu}{/topbar}', false);

            if (!_instance.hasTemplate('Footer'))
                _instance.addTemplate('Footer', '{menu}{username}{accountButton}', false);

            if (!_instance.hasTemplate('Login'))
                _instance.addTemplate('Login', '{logo}{username}{password}{rememberMe}{loginButton}{failedMessage}', false);

            if (!_instance.hasTemplate('LoginVerification'))
                _instance.addTemplate('LoginVerification', '{logo}{verificationCode}{verificationButton}{failedMessage}', false);

            if (!_instance.hasTemplate('Error'))
                _instance.addTemplate('Error', '<p><b>Description:</b> {message}</p><p><b>Status:</b> {status}</p><p><b>Timestamp:</b> {timestamp}</p><p><b>Log Id:</b> {id}</p>', false);

            if (!_instance.hasTemplate('NotFound'))
                _instance.addTemplate('NotFound', '<p>The page you are looking for does not exist.</p>', false);

            draw();
        }

        /** 
        * Handles the post render procedure.
        */
        this.postRender = function ()
        {
            if (_instance.renderState != $base.static.RenderState.RENDERING) // extra safety to never execute a postRender when the component state is incorrect
                return;

            postRender();
        }

        /** 
         * Destroys the component.
         * @see {@link componyx.UI.base.methods#destroy}
         */
        this.destroy = function (...args)
        {
            dispose();
            $base.methods.destroy.call(this, ...args);
        };

        function preRender()
        {
            // initialize script and css
            return ['AppSkin', ['Button', 'FormField', 'Box', 'Menu']];
        }

        async function postRender()
        {
            if (_instance.useBindary)
                await handleRoutes();

            if (!_instance.ajax.authenticate.isDefined())
                _instance.ajax.authenticate.url = 'authenticate';

            if (!_instance.ajax.search.isDefined())
                _instance.ajax.search.url = 'search';

            _login.style.display = 'none';

            launch();
            $base.methods.postRender.call(_instance);
        }

        async function handleRoutes()
        {
            await componyx.bindary_modules.loaded; // make sure Bindary is loaded

            if ($bindary.routes && $bindary.routes.length) // routes are handled by the Bindary framework
            {
                $bindary.onAnchorScroll.add(anchorScroll);
                $bindary.onLoad.add(loadRoute);

                if ($bindary.linkDispatching && !_instance.events.onRenderSearchResult.has(dispatchLink))
                    _instance.events.onRenderSearchResult.priorityAdd(dispatchLink);
            }

            _view.firstChild.setAttribute($bindary.attributePrefix + 'view', '');
        }

        function loadRoute()
        {
            let routePath = $bindary.routePath,
                anchor = $bindary.getAnchor();

            if (anchor)
                routePath += '#' + anchor;

            if ($bindary.prettyURL)
            {
                let baseHref = $bindary.getBaseHref();

                if (!$lib.isEmpty(baseHref) && $lib.startsWith(routePath, baseHref))
                    routePath = routePath.replace(baseHref, '');
            }

            updateMenuState(routePath, !$bindary.prettyURL);
            _launch = false;
        }

        function dispatchLink(instance, args)
        {
            $bindary.dispatchLink(args.anchor);
        }

        function anchorScroll(el)
        {
            if (!_header)
                return;

            let height = _header.offsetHeight;

            if (_topbar)
                height += _topbar.offsetHeight;

            $lib.scrollTo(el);
            document.documentElement.scrollTop -= height;

            return false;
        }

        function updateMenuState(routePath, hashtagRoutes)
        {
            let routePathMatching = _instance.menuRoutePathMatching;

            if (routePathMatching == _routePathMatchingOption.DISABLED)
                return;

            routePath = routePath.toLowerCase();

            let anchorlessItem,
                hasAnchor = routePath.indexOf('#') > -1,
                anchorlessRoutePath = (hasAnchor) ? routePath.split('#')[0] : null;

            let path = $lib.path(_instance.menu, 'itemList', function (item)
            {
                let href = (item.href || '').toLowerCase();

                if ($lib.isEmpty(href))
                    return false;

                // a category whose own href equals a direct child's href should defer to that child, so the more specific item is selected, not the category
                if (item.itemList && item.itemList.some(child => (child.href || '').toLowerCase() === href))
                    return false;

                if (hashtagRoutes && href.indexOf('#') == 0)
                {
                    href = href.substr(1);

                    if (href.indexOf('!') == 0) // hash-bang
                        href = href.substr(1);

                    if ($lib.isEmpty(href))
                        return false;
                }

                if (hasAnchor && anchorlessRoutePath === href.toLowerCase())
                    anchorlessItem = item;

                if (routePathMatching == _routePathMatchingOption.PARTIAL)
                    return (routePath === href || (routePath.indexOf(href) == 0 && '?/'.indexOf(routePath.split(href)[1][0]) > -1));
                else
                    return (routePath === href);

            }, true);

            if (!path && anchorlessItem)
                path = $lib.path(_instance.menu, 'itemList', function (item) { return (item === anchorlessItem) }, true); // item was found without anchor

            if (path && !path.item.selected)
            {
                let root = path.create().root(), headerPath;

                if (root.item.menuSection == _menuSectionOption.HEADER)
                {
                    headerPath = (root.item == path.item) ? path.create() : getLastHeaderItem(path.create());

                    if (headerPath && !headerPath.item.selected)
                    {
                        let headerItems = buildPath(headerPath.create());
                        if (headerItems?.length)
                            _headerMenu.expand(headerItems, null, false, true);

                        _headerMenu.collapseAll(true); // collapse all dynamic positioned item-groups
                        selectItem(_headerMenu, headerPath.item);
                    }
                }

                if (!path.item.selected)
                {
                    if (isSideMenu())
                    {
                        let mainItems = buildPath(path.create(), true);
                        if (mainItems?.length)
                            _mainMenu.expand(mainItems, null, false, true);
                    }

                    selectItem(_mainMenu, path.item, isSideMenu() && (!$lib.event || $lib.event.type != 'click' || !isMainMenuTarget($lib.event.target)));
                }
            }
            else if (!path)
            {
                deselectItem(_mainMenu);
                deselectItem(_headerMenu);
                deselectItem(_footerMenu);
                deselectItem(_quickLaunchMenu);

                if (_mainMenu)
                    _mainMenu.showCategory(null, false, true); // main category

                checkHeaderOverflow(null);
            }
        }

        function deselectItem(menu)
        {
            if (menu)
                menu.deselectItem();
        }

        function isMainMenuTarget(target)
        {
            return ($lib.contains(_mainMenu.element, target));
        }

        function getLastHeaderItem(path)
        {
            let item;

            while (path)
            {
                item = path.item;

                if (item.isCategory && !item.categoryInHeader && _headerMenu.loadItem(item.id))
                    return path;

                path = (path.hasParent()) ? path.parent() : null;
            }

            return null;
        }

        function buildPath(path, includeCurrent)
        {
            let items = [];

            if (includeCurrent && !$lib.isEmpty(path.children))
                items.push(path.item.id);

            while (path.hasParent())
            {
                items.unshift(path.parent().item.id);
            }

            return items;
        }

        function launch()
        {
            _launch = true;
            hideAll();

            if (_instance.authenticationRequired && !_instance.authenticated)
            {
                $lib.addClass(_instance.element, _instance.getCssClass(_classOption.REQUIRED));
                _instance.showLogin();
            }
            else if (_instance.launchMenu)
                showMenu();
            else
                _instance.showPage();

            checkHeaderOverflow();
        }

        function draw()
        {
            let el = _instance.element, htmlTag = $lib(null, '', 'html', true);

            _instance.element.classList.forEach(c =>
            {
                if (c !== 'app-skin' && c !== 'hidden')
                    htmlTag.classList.add(c);
            });

            if (_instance.menuLeft)
                $lib.addClass(el, _instance.getCssClass(_classOption.MENU_LEFT));

            createLayout(el);

            _instance.setFullscreen(_instance.fullscreen);
            _instance.setFullpage(_instance.fullpage);

            if (_instance.footerDisplay == _footerDisplayOption.PERSISTENT)
                showFooter();

            bindEvents();
            bindErrorEvent();
            _instance.renderChildren();
        }

        function createPreloader(container)
        {
            let div = document.createElement('div'),
                i = div.appendChild(document.createElement('i')),
                id = _instance.id + '_preloader', b;

            b = div.appendChild(document.createElement('b'));
            b.appendChild(document.createTextNode(_instance.loadingLabel));
            i.className = _instance.getCssClass(_classOption.SPINNER);
            _preloader = $UI.createComponent(componyx.UI.Box, { id: id, containerElement: container });
            _instance.store.push(id);

            _preloader.setContentTemplate(div);
            _preloader.cssClass = `${_instance.getCssClass(_classOption.BOX)} ${_instance.getCssClass(_classOption.PRELOADER)}`;
            _preloader.showing = false;
            _preloader.modal = true;
            _preloader.theme = $base.static.ThemeOption.NONE;
            _preloader.animation.showType = _preloader.animation.hideType = componyx.UI.Box.AnimationTypeOption.NONE;
            _preloader.autoPosition = componyx.UI.Box.AutoPositionOption.CENTER;
            _preloader.events.onPostRender.priorityAdd(function () { _instance.isReady.apply(_instance); }, null);
        }

        function bindEvents()
        {
            $lib.on(window, 'resize', resize);
            $lib.on(document, 'click', hideSearchResult);

            if (isSideMenu())
                $lib.on(_overlay, 'click', detectMenuToggle);
        }

        function bindErrorEvent()
        {
            $lib.httpRequestHandlers.onSuccess.add(function (args)
            {
                let contentType = args.xhr.getResponseHeader('content-type'),
                    data = args.data,
                    parse = function (d) { return (typeof d == 'string') ? window.JSON.parse(d) : d };

                if (contentType && contentType.toLowerCase().indexOf('application/json') > -1 && data)
                {
                    data = parse(data);

                    if (data && data.d)
                        data = parse(data.d);

                    return error(data);
                }
            });

            if (!_instance.useBindary)
                return;

            componyx.bindary_modules?.loaded.then(() =>
            {
                $bindary.onDataError.add(function (data)
                {
                    return error(data);
                });

                $bindary.onRouteError.add(function (args)
                {
                    const notFound = (args.type === 'route' || args.status === 404 || args.status === 410);

                    if (notFound && !document.head.querySelector('meta[data-appskin-noindex]')) // avoid soft 404s: tell search engines not to index this result
                        document.head.insertAdjacentHTML('beforeend', '<meta name="robots" content="noindex" data-appskin-noindex>');

                    showError({ status: args.status }, notFound ? 'NotFound' : 'Error');
                });

                $bindary.onPreLoad.add(function () // a new route load starts, so hide a previous error again
                {
                    _errorData = null;
                    document.head.querySelector('meta[data-appskin-noindex]')?.remove();
                    _instance.showPage(true);
                });
            }).catch(console.error);
        }

        function error(data)
        {
            if (!data || !data.isError)
            {
                _instance.showPage(true);
                return;
            }

            let errorData = (data.data && data.data.appData) ? data.data.appData : data;

            if (_errorData != errorData)
            {
                _errorData = errorData;
                return showError(errorData);
            }
        }

        function showError(error, templateName = 'Error')
        {
            let divMessage,
                timestamp = error.timestamp;

            if (timestamp && !(timestamp instanceof Date))
                timestamp = new Date(timestamp);

            _instance.preloader().hide();
            _instance.showPage();
            $lib.addClass(_instance.element, _instance.getCssClass(_classOption.ERROR));
            _view.style.display = 'none'; // hide view container

            let el = _error.firstChild;
            el.innerHTML = '';
            _error.style.display = '';

            divMessage = createElement(el, 'div');

            _instance.applyTemplate(divMessage, templateName, {
                timestamp: (timestamp && !isNaN(timestamp)) ? $lib.formatDate(timestamp, 'dd-MM-yyyy HH:mm:ss') : '-',
                message: error.message || '-',
                stackTrace: error.stackTrace || '-',
                id: error.id || '-',
                status: error.status || '-'
            });

            _instance.events.onShowError.fire(_instance);

            return false;
        }

        function createLayout(container)
        {
            let div = createElement(container, 'div', _instance.getCssClass(_classOption.BODY));

            createMainMenu(container);
            createHeader(container);
            createSidebar(container);

            _page = createElement(container, '', _instance.getCssClass(_classOption.PAGE));

            if (_instance.hasTemplate('PageHeader'))
            {
                div = createElement(_page, 'header');
                _instance.applyTemplate(div, 'PageHeader');
            }

            _error = createElement(_page, '', _instance.getCssClass(_classOption.ERROR), createContent());
            _error.style.display = 'none';

            _view = createElement(_page, '', _instance.getCssClass(_classOption.VIEW), createContent());

            if (_instance.hasTemplate('PageFooter'))
            {
                div = createElement(_page, 'footer');
                _instance.applyTemplate(div, 'PageFooter');
            }

            if (_instance.useLoginTemplate)
            {
                createLoginScreen(container);
                createLoginVerificationScreen(container);
            }

            if (_instance.footerDisplay > _footerDisplayOption.DISABLED)
                createFooter(container);

            _overlay = createElement(container, 'div', _instance.getCssClass(_classOption.OVERLAY));

            if (_instance.authenticated)
                $lib.addClass(_instance.element, _instance.getCssClass(_classOption.AUTHENTICATED));

            createPreloader(container);
        }

        function createSidebar(container)
        {
            let name = 'Sidebar';

            if (!_instance.hasTemplate(name))
                return;

            let id = $lib.format('{0}_{1}_', _instance.id, name),
                bar = createElement(container, '', _instance.getCssClass(_classOption.SIDEBAR), content);

            _instance.applyTemplate(bar, name, getinterpolations(id));
            replacePlaceHolders(id);
        }

        function createHeader(container)
        {
            let id = _instance.id + '_Header_', el;

            _header = createElement(container, 'header'); // create header
            _instance.applyTemplate(_header, 'Header', getinterpolations(id));
            _header.appendChild(createContent($lib.extract(_header)));

            _topbar = $lib('#' + id + 'TopBar');

            if (_topbar)
            {
                _topbar.appendChild(createContent($lib.extract(_topbar)));
                $lib.addClass(_instance.element, _instance.getCssClass(_classOption.TOPBAR));
            }

            if ((el = $lib('#' + id + 'Menu')) && hasMenu(_menuSectionOption.HEADER))
                _headerMenu = createMenu(el.parentNode, el.id, _instance.headerMenuId, _menuSectionOption.HEADER, getHeaderProps());

            replacePlaceHolders(id);
        }

        function createFooter(container)
        {
            let id = _instance.id + '_Footer_', el;

            _footer = createElement(container, 'footer'); // create footer
            _instance.applyTemplate(_footer, 'Footer', getinterpolations(id));
            _footer.appendChild(createContent($lib.extract(_footer)));

            if ((el = $lib('#' + id + 'Menu')) && hasMenu(_menuSectionOption.FOOTER))
                _footerMenu = createMenu(el.parentNode, el.id, _instance.headerMenuId, _menuSectionOption.FOOTER, getFooterProps());

            replacePlaceHolders(id);
        }

        function replacePlaceHolders(id)
        {
            let el;

            if ((el = $lib('#' + id + 'QuickLaunchMenu')) && hasMenu(_menuSectionOption.QUICKLAUNCH))
                _quickLaunchMenu = createMenu(el.parentNode, el.id, _instance.quickLaunchMenuId, _menuSectionOption.QUICKLAUNCH, getQuickLaunchProps());

            if (el = $lib('#' + id + 'SearchBox'))
                _searchBox = createSearchBox(el);

            if (el = $lib('#' + id + 'Username'))
                el.innerHTML = _instance.username;

            createMenuButton($lib('#' + id + 'MenuButton'));
            createAccountButton($lib('#' + id + 'AccountButton'));
        }

        function hasMenu(menuSection)
        {
            let hasMenu = false;

            $lib.each(_instance.menu, function (item)
            {
                if (item.menuSection === menuSection)
                    return !(hasMenu = true); // stop iteration
            });

            return hasMenu;
        }

        function createContent(content)
        {
            return createElement(null, '', _instance.getCssClass(_classOption.APP_CONTENT), content);
        }

        function joinCssClasses(...classes)
        {
            return classes.filter(c => !$lib.isEmpty(c)).join(' ').replace(/\s+/g, ' ').trim();
        }

        function createElement(container, tagName, cssClass, content)
        {
            return $lib.element(container, '', tagName, content, (cssClass) ? { "class": cssClass } : null);
        }

        function createSearchBox(placeHolder)
        {
            let div = createElement(null, 'div', _instance.getCssClass(_classOption.SEARCH)),
                input = createElement(div, 'input');
            placeHolder.parentNode.replaceChild(div, placeHolder);

            div.setAttribute('tabindex', '0');
            input.placeholder = _instance.searchLabel;

            $lib.on(div, 'focus', function ()
            {
                $lib.addClass(_instance.element, _instance.getCssClass(_classOption.SEARCH_ACTIVE));
                input.focus();
            });
            $lib.on(input, 'blur', function ()
            {
                $lib.removeClass(_instance.element, _instance.getCssClass(_classOption.SEARCH_ACTIVE));
            });

            $lib.on(input, 'keyup paste', function ()
            {
                clearTimeout(_searchTimerId);
                _searchTimerId = setTimeout(search, _instance.searchDelay);
            });
            $lib.on(input, 'focus', function ()
            {
                $lib.addClass(_instance.element, _instance.getCssClass(_classOption.SEARCH_ACTIVE));

                if (_searchResult && !$lib.isEmpty(_searchBox.value))
                    _searchResult.style.display = '';
            });

            return input;
        }

        function createMenuButton(placeHolder)
        {
            if (!placeHolder)
                return;

            _menuButton = createButton(placeHolder.parentNode, placeHolder.id, _instance.menuButtonId, { cssClass: _instance.getCssClass(_classOption.MENU_BUTTON), cssClassIcon: _instance.getCssClass(_classOption.ICON_MENU) }, function (button, args)
            {
                toggleMenu();
            });
        }

        function createAccountButton(placeHolder)
        {
            if (!placeHolder)
                return;

            let authenticated = _instance.authenticated,
                action = $base.static.getMethod(_instance.accountAction),
                item = {};

            if (!action)
                action = (authenticated) ? _instance.showLogin : _instance.logout;

            item.cssClass = _instance.getCssClass(_classOption.ACCOUNT);

            if (authenticated && _instance.accountButtonAvatar)
            {
                item.cssClass = _instance.getCssClass(_classOption.ACCOUNT_AVATAR);
                _instance.element.style.setProperty("--avatar-initials", `'${_instance.avatarInitials}'`);
            }
            else if (authenticated)
                item.cssClassIcon = _instance.getCssClass(_classOption.ICON_USER);
            else
            {
                item.cssClassIcon = _instance.getCssClass(_classOption.ICON_LOCK);
                action = _instance.showLogin;
            }

            createButton(placeHolder.parentNode, placeHolder.id, _instance.accountButtonId, item, action);

            if (_instance.avatarImagePath)
                _instance.element.style.setProperty("--avatar-image", `url('${_instance.avatarImagePath}')`);
        }

        function createMainMenu(container)
        {
            let id = _instance.id + '_MainMenu';

            if (isSideMenu())
                container = createSideMenuBox(container);

            _mainMenu = createMenu(container, id, _instance.mainMenuId, _menuSectionOption.MAIN, getMainMenuProps());
        }

        function createMenu(container, id, cloneId, section, properties)
        {
            if (!container || !_instance.menu.length)
                return;

            if (!properties)
                properties = {};

            properties.id = id;
            properties.containerElement = container;

            let menu = $UI.createComponent(componyx.UI.Menu, properties),
                groupSettings;

            menu.clone($UI.store[cloneId], _instance);
            menu.templates = getMenuItemTemplates();
            menu.mainCategoryLabel = _instance.mainCategoryLabel;
            menu.events.onPostRender.priorityAdd(function () { _instance.isReady.apply(_instance); }, null);
            menu.showing = ((section == _menuSectionOption.MAIN && isSideMenu()) || section == _menuSectionOption.HEADER || section >= _menuSectionOption.FOOTER);

            if (section == _menuSectionOption.HEADER)
                menu.itemGroupBoxId = createHeaderItemGroupBox(); // default root item-group box for the header menu

            if (section == _menuSectionOption.MAIN)
                menu.events.onHide.priorityAdd(function () { $lib.removeClass(_instance.element, _instance.getCssClass(_classOption.PORTAL_MENU)); });

            $lib.each(_instance.menu, function (item, index)
            {
                if (item.menuSection == section || (section == _menuSectionOption.MAIN && item.menuSection == _menuSectionOption.HEADER))
                {
                    item.id = item.id || $lib.guid();

                    if (section == _menuSectionOption.HEADER)
                        item = copyItem(item); // copy header menu-item

                    if (section == _menuSectionOption.HEADER
                        || (section == _menuSectionOption.MAIN && item.menuSection == _menuSectionOption.HEADER)
                        || (section == _menuSectionOption.MAIN && _instance.menuType == _menuTypeOption.PORTALMENU))
                    {
                        if (!item.selectable && !item.command && !item.href)
                            item.cssClass = joinCssClasses(item.cssClass, _instance.getCssClass(_classOption.NO_ACTION));

                        // menu-item is in both header and main navigation
                        if (item.__command === undefined)
                        {
                            item.__command = item.command || null;
                            item.command = defaultCommand;
                        }
                        else
                            item.command = defaultCommand;

                        if (item.itemList)
                            setCommands(item.itemList);
                    }

                    if (section == _menuSectionOption.MAIN && item.menuSection == _menuSectionOption.MAIN)
                        _allInHeader = false;

                    if (section == _menuSectionOption.MAIN && _instance.menuType == _menuTypeOption.PORTALMENU)
                    {
                        groupSettings = createPortalItem(item, index, groupSettings);

                        if (item.isCategory)
                            createPortalItems(item.itemList);
                    }

                    menu.itemList.push(item);
                }
            });

            return menu;
        }

        function copyItem(cloneItem)
        {
            let item = new componyx.UI.AppSkin.MenuItem(cloneItem);

            item.selectable = true;
            item.command = item.__command;
            item.subGroupId = null;

            if (item.__cssClass != undefined)
                item.cssClass = item.__cssClass;

            if (item.isCategory && !item.categoryInHeader)
            {
                item.isCategory = false;
                item.itemList = [];
                return item;
            }

            $lib.each(cloneItem.itemList, function (childItem, index)
            {
                item.itemList[index] = copyItem(childItem);
            });

            return item;
        }

        function createPortalItems(itemList)
        {
            let groupSettings;

            $lib.each(itemList, function (item, index)
            {
                groupSettings = createPortalItem(item, index, groupSettings);

                if (item.isCategory)
                    createPortalItem(item.itemList);
            });
        }

        function createPortalItem(item, index, groupSettings)
        {
            let cssStyles = ['1', '2', '3', '4'], cssStyle;

            item.cssClass = item.cssClass || '';
            item.__cssClass = item.cssClass;

            if (!item.groupTileSize)
                item.groupTileSize = null;

            if (!groupSettings || (!$lib.isEmpty(item.groupTileSize) && item.groupTileSize != groupSettings.groupTileSize))
            {
                groupSettings = {};
                groupSettings.tileSize = 0;
                groupSettings.id = $lib.guid();
                groupSettings.groupTileSize = (item.groupTileSize) ? item.groupTileSize : (item.buttonTileSize <= _tileSizeOption.MEDIUM) ? _tileSizeOption.MEDIUM : _tileSizeOption.LARGE;
                item.cssClassSubGroup = joinCssClasses(_instance.getCssClass(_classOption.SUB_GROUP), _tileSizeOption.getName(groupSettings.groupTileSize).replace('_', '-'));
            }

            item.subGroupId = groupSettings.id; // item will be appended to the group container element
            item.buttonTileSize = item.buttonTileSize || _tileSizeOption.MEDIUM;
            item.cssClass = joinCssClasses(item.cssClass, _tileSizeOption.getName(item.buttonTileSize).replace('_', '-'));

            cssStyle = cssStyles[(index % 4)];

            if (cssStyle)
                item.cssClass = joinCssClasses(item.cssClass, _instance.getCssClass(_classOption.SHADE) + '-' + cssStyle);

            if ((index % 4) == 3)
                cssStyles.reverse();

            if (groupSettings.groupTileSize == _tileSizeOption.LARGE && item.buttonTileSize <= _tileSizeOption.SMALL_WIDE && (groupSettings.tileSize == 2 || groupSettings.tileSize == 10))
                item.cssClass = joinCssClasses(item.cssClass, _instance.getCssClass(_classOption.ROW_START));

            groupSettings.tileSize += item.buttonTileSize;

            if (groupSettings.tileSize >= groupSettings.groupTileSize)
                groupSettings = null; // group is filled

            return groupSettings;
        }

        function getMenuItemTemplates()
        {
            let templates = new Map(),
                reserved = 'Header Footer Login Error PageHeader PageFooter';

            if (_instance.templates.size)
            {
                _instance.templates.forEach(function (template, id)
                {
                    if (reserved.indexOf(id) == -1)
                        templates.set(id, template);
                });
            }

            return templates;
        }

        function setCommands(itemList)
        {
            $lib.each(itemList, function (item, index)
            {
                item.id = item.id || $lib.guid();

                if (!item.selectable && !item.command && !item.href)
                    item.cssClass = joinCssClasses(item.cssClass, _instance.getCssClass(_classOption.NO_ACTION));

                if (item.__command === undefined)
                {
                    item.__command = item.command || null;
                    item.command = defaultCommand;
                }
                else
                    item.command = defaultCommand;

                if (item.itemList)
                    setCommands(item.itemList);
            });
        }

        function defaultCommand(sender, args)
        {
            let isMain = (sender === _mainMenu),
                menu = (isMain) ? _headerMenu : _mainMenu;

            if (isMain && args && args.event && args.event.type == 'click' && !args.item.isCategory && args.item.selectable && $lib.styleValue(_overlay, 'display', true) != 'none') // menu is in overlay-mode (small template)
                hideMenu();

            if (!menu) // no header menu, handle portal-type case directly
            {
                if (_instance.menuType === _menuTypeOption.PORTALMENU)
                {
                    let portalItemPath = _mainMenu.loadItem(args.item.id),
                        portalItem = portalItemPath?.item;

                    if (!portalItem)
                        return;

                    executeCommand(_mainMenu, portalItem);
                }

                return;
            }

            let itemPath = menu.loadItem(args.item.id),
                item = itemPath?.item;

            if (!item)
            {
                // item only exists in the main menu (e.g. child of a category not shown in the header): fire its original command
                if (isMain && args.item.__command)
                {
                    let fn = $base.static.getMethod(args.item.__command);

                    if (fn)
                        fn(sender, args);
                }

                return;
            }

            executeCommand(menu, item);

            if (!isMain)
            {
                if (item.isCategory) // header opens category in main-menu
                {
                    _mainMenu.showCategory(item.id, false, !menuIsShowing());

                    if (!menuIsShowing())
                        showMenu();

                    checkHeaderOverflow(null);
                }
                else if (menuIsShowing())
                {
                    hideMenu(false, showMainCategory);
                }
                else
                {
                    showMainCategory();
                }
            }
        }

        function executeCommand(menu, item)
        {
            item.command = item.__command; // original command
            selectItem(menu, item); // fire original command and set selected state
            item.command = defaultCommand; // reset command back to default

            if (item.href && (_instance.menuType == _menuTypeOption.PORTALMENU || _error.style.display != 'none'))
                _instance.showPage(true);
        }

        function showMainCategory()
        {
            _mainMenu.showCategory(null, false, true);
            checkHeaderOverflow(null);
        }

        function setHideMenuCallback(fn)
        {
            if (isSideMenu())
                _sideMenuBox.events.onHideComplete.priorityAdd(fn, null, true);
            else
                _mainMenu.events.onHide.priorityAdd(fn, null, true);
        }

        function selectItem(menu, item, scroll)
        {
            let href;

            href = item.href || null;
            item.href = null; // item was matched on current routePath, there is no reason to re-set URL and re-setting can cause issues when there is a routePath and an anchor in the current URL	

            menu.selectItem(item.id);

            if (href != undefined)
                item.href = href;

            if (scroll)
                setTimeout($lib.scrollTo.bind(this, $UI.store[menu.id + '_' + item.id].element, _sideMenuBox.element), 0);
        }

        function createButton(container, id, cloneId, item, command)
        {
            let button = $UI.createComponent(componyx.UI.Button, { id: id, containerElement: container }), b;

            button.clone($UI.store[cloneId], _instance);
            button.renderId = false;
            button.transparent = ($lib.isEmpty(item.transparent)) ? true : item.transparent;
            button.cssClass = joinCssClasses(_instance.getCssClass(_classOption.BUTTON), item.cssClass);
            button.cssClassIcon = ($lib.isEmpty(item.cssClassIcon)) ? '' : item.cssClassIcon;
            button.hasIcon = !$lib.isEmpty(item.cssClassIcon);
            button.command = (button.command) ? button.command : command;
            button.events.onPostRender.priorityAdd(function () { _instance.isReady.apply(_instance); }, null);
            button.showing = true;

            if (!($lib.isEmpty(item.text)))
            {
                b = document.createElement('b');
                $lib.setText(b, item.text);
                button.text = b.outerHTML;
            }

            return button;
        }

        function createSideMenuBox(container)
        {
            let id = _instance.id + '_SideMenuBox',
                cloneId = _instance.sideMenuBoxId,
                box = $UI.createComponent(componyx.UI.Box, { id: id, containerElement: container });

            box.clone($UI.store[cloneId], _instance);
            box.theme = $base.static.ThemeOption.NONE;
            box.cssClass = `${_instance.getCssClass(_classOption.BOX)} ${_instance.getCssClass(_classOption.SIDE_MENU)}`;
            box.animation.showType = box.animation.hideType = 3;
            box.autoPosition = 0;
            box.autoFit = false;
            box.events.onHideComplete.priorityAdd(function () { $lib.removeClass(_instance.element, _instance.getCssClass(_classOption.SIDE_MENU)); });
            box.render(); // instant because there are no dependencies

            _sideMenuBox = box;

            return box.contentElement;
        }

        function createHeaderItemGroupBox()
        {
            let id = _instance.id + '_HeaderMenuBox',
                box = $UI.createComponent(componyx.UI.Box, { id: id, containerElement: null });
            box.alignX = componyx.UI.Box.AlignXOption.CENTER;
            return box.id;
        }

        function getHeaderProps()
        {
            let props = {};

            props.cssClass = `${_instance.getCssClass(_classOption.MENU)} ${_instance.getCssClass(_classOption.HEADER_MENU)}`;
            return props;
        }

        function getQuickLaunchProps()
        {
            let props = {};

            props.cssClass = `${_instance.getCssClass(_classOption.MENU)} ${_instance.getCssClass(_classOption.QUICK_LAUNCH)}`;
            return props;
        }

        function getFooterProps()
        {
            let props = {};

            props.cssClass = `${_instance.getCssClass(_classOption.MENU)} ${_instance.getCssClass(_classOption.FOOTER_MENU)}`;
            return props;
        }

        function getMainMenuProps()
        {
            let props = {};

            props.cssClass = joinCssClasses(_instance.getCssClass(_classOption.MENU), _instance.getCssClass(_classOption.MAIN), (isSideMenu()) ? _instance.getCssClass(_classOption.SIDE) : _instance.getCssClass(_classOption.PORTAL));
            props.horizontalRoot = !isSideMenu();

            if (isSideMenu())
            {
                let defaultButton = $UI.createComponent(componyx.UI.Button, { id: _instance.id + '_DefaultButton', decoration: 1 });
                props.buttonId = defaultButton.id;
            }

            return props;
        }

        function getinterpolations(id)
        {
            // replacement values for template
            let values = {};
            values.topbar = '<div id="' + id + 'TopBar" class="topbar">';
            values['/topbar'] = '</div>';
            values.logo = '<figure id="' + id + 'Logo" class="logo"></figure>';
            values.menuButton = '<a id="' + id + 'MenuButton"></a>';
            values.accountButton = '<a id="' + id + 'AccountButton"></a>';
            values.loginButton = '<a id="' + id + 'LoginButton"></a>';
            values.menu = '<b id="' + id + 'Menu"></b>';
            values.quickLaunchMenu = '<b id="' + id + 'QuickLaunchMenu"></b>';
            values.searchBox = '<div id="' + id + 'SearchBox"></div>';
            values.username = '<b id="' + id + 'Username" class="username"></b>';
            values.password = '<b id="' + id + 'Password"></b>';
            values.rememberMe = '<b id="' + id + 'RememberMe"></b>';
            values.failedMessage = '<b id="' + id + 'FailedMessage"></b>';
            values.verificationCode = '<b id="' + id + 'VerificationCode"></b>';
            values.verificationButton = '<a id="' + id + 'VerificationButton"></a>';
            return values;
        }

        function createLoginScreen(container)
        {
            let id = _instance.id + '_Login_', el, i, div;

            _login = createElement(container, '', _instance.getCssClass(_classOption.LOGIN_SCREEN));
            _instance.applyTemplate(_login, 'Login', getinterpolations(id));
            createElement(_login, '', _instance.getCssClass(_classOption.CONTENT), $lib.extract(_login));

            if (el = $lib('#' + id + 'Username'))
            {
                div = createElement(null, '', _instance.getCssClass(_classOption.USER));
                el.parentNode.replaceChild(div, el);

                _user = createInput('username');
                createFormField(div, el.id, _instance.usernameFormFieldId, _instance.usernameLabel, _user);

                i = createElement(div, 'i', _instance.getCssClass(_classOption.ICON_USER));
            }

            if (el = $lib('#' + id + 'Password'))
            {
                div = createElement(null, '', _instance.getCssClass(_classOption.PASS));
                el.parentNode.replaceChild(div, el);

                _pass = createInput('password');
                createFormField(div, el.id, _instance.passwordFormFieldId, _instance.passwordLabel, _pass);

                i = createElement(div, 'i', _instance.getCssClass(_classOption.ICON_KEY));
                i = createElement(div, 'i', _instance.getCssClass(_classOption.ICON_EYE));
                bindInputEvents(_pass);
                $lib.on(i, 'click', togglePasswordDisplay);
            }

            if (_instance.showRememberMe && (el = $lib('#' + id + 'RememberMe')))
            {
                div = createElement(null, '', _instance.getCssClass(_classOption.REMEMBER));
                el.parentNode.replaceChild(div, el);

                _remember = createElement(null, 'input');
                _remember.type = 'checkbox';
                _remember.checked = true;
                createFormField(div, el.id, _instance.rememberMeFormFieldId, _instance.rememberMeLabel, _remember);
            }

            if (el = $lib('#' + id + 'LoginButton'))
            {
                div = createElement();
                el.parentNode.replaceChild(div, el);
                createButton(div, el.id, _instance.loginButtonId, { cssClass: _instance.getCssClass(_classOption.LOGIN), text: _instance.loginButtonLabel, transparent: false }, function () { login(); });
            }

            if (el = $lib('#' + id + 'FailedMessage'))
            {
                _loginFailedMessage = createElement(null, '', _instance.getCssClass(_classOption.MESSAGE));
                el.parentNode.replaceChild(_loginFailedMessage, el);
            }
        }

        function createLoginVerificationScreen(container)
        {
            let id = _instance.id + '_LoginVerification_', el, div;

            _loginVerification = createElement(container, '', `${_instance.getCssClass(_classOption.LOGIN_SCREEN)} ${_instance.getCssClass(_classOption.LOGIN_VERIFICATION)}`);
            _loginVerification.style.display = 'none';
            _instance.applyTemplate(_loginVerification, 'LoginVerification', getinterpolations(id));
            createElement(_loginVerification, '', _instance.getCssClass(_classOption.CONTENT), $lib.extract(_loginVerification));

            if (el = $lib('#' + id + 'VerificationCode'))
            {
                div = createElement(null, '', _instance.getCssClass(_classOption.CODE));
                el.parentNode.replaceChild(div, el);

                _verificationCode = createInput('code');
                _verificationCode.maxLength = _instance.verificationCodeLength;
                createFormField(div, el.id, _instance.verificationCodeFormFieldId, _instance.verificationCodeLabel, _verificationCode);
            }

            if (el = $lib('#' + id + 'VerificationButton'))
            {
                div = createElement();
                el.parentNode.replaceChild(div, el);
                createButton(div, el.id, _instance.verificationButtonId, { cssClass: _instance.getCssClass(_classOption.VERIFICATION), text: _instance.verificationButtonLabel, transparent: false }, function () { verifyCode(); });
            }

            if (el = $lib('#' + id + 'FailedMessage'))
            {
                _verificationFailedMessage = createElement(null, '', _instance.getCssClass(_classOption.MESSAGE));
                el.parentNode.replaceChild(_verificationFailedMessage, el);
            }
        }

        function createFormField(container, id, cloneId, label, input)
        {
            let field = $UI.createComponent(componyx.UI.FormField, { id: id, containerElement: container });

            field.clone($UI.store[cloneId], _instance);

            field.setFieldTemplate(input);
            field.label = label;
            field.labelDisplay = (input.type == 'checkbox') ? 0 : componyx.UI.FormField.LabelDisplayOption.INSIDE;
            field.events.onPostRender.priorityAdd(function () { _instance.isReady.apply(_instance); }, null);
            field.showing = true;
            field.render();
        }

        function createInput(name)
        {
            return $lib.element('', '', 'input', null, { type: 'text', name: name, autocomplete: 'off', spellcheck: 'false' });
        }

        function bindInputEvents(input)
        {
            if (input.name == 'pass')
            {
                $lib.on(input, 'keydown', function (e)
                {
                    if (e.key == 'Enter')
                        login();
                });
            }
        }

        function togglePasswordDisplay(e)
        {
            let el = this,
                showing = $lib.hasClass(el, _instance.getCssClass(_classOption.ICON_EYE_BLOCKED));

            _pass.type = (showing) ? 'password' : 'text';
            el.className = (showing) ? _instance.getCssClass(_classOption.ICON_EYE) : _instance.getCssClass(_classOption.ICON_EYE_BLOCKED);
        }

        function search(terms)
        {
            terms = (terms != undefined) ? terms : _searchBox.value;
            let settings = { terms: terms };

            if ($lib.isEmpty(terms))
            {
                if (_searchResult)
                    _searchResult.style.display = 'none';

                return;
            }

            _instance.ajaxCall('search', settings,
                {
                    onSuccess: function (args)
                    {
                        showSearchResult(args.data);
                    },
                    onError: function (args)
                    {
                        createSearchResult(_instance.searchNoResultLabel);
                    }
                });
        }

        function showSearchResult(data)
        {
            let eventArgs = { data: data, container: _searchResult, cancel: false },
                categories = {};

            createSearchResult('');
            _instance.events.onPreSearchResults.fire(_instance, eventArgs);

            if (eventArgs.cancel === true)
                return;

            if (data && data.length > 0)
            {
                $lib.each(data, function (item)
                {
                    let route = item.route.replace(/\\/, '/').toLowerCase(),
                        title = item.title,
                        cat = getSearchCategory(route);

                    if (!categories[cat])
                    {
                        categories[cat] = createElement(_searchResult, 'nav');
                        createElement(categories[cat], 'h2', '', cat);
                    }

                    let a = $lib.element(categories[cat], '', 'a', title, { href: route }),
                        itemEventArgs = { ...eventArgs, item: item, anchor: a };

                    _instance.events.onRenderSearchResult.fire(_instance, itemEventArgs);
                });
            }
            else
                _searchResult.innerHTML = _instance.searchNoResultLabel;

            $lib.each(categories, function (nav)
            {
                nav.firstElementChild.textContent += ' (' + (nav.childNodes.length - 1) + ')';
            });

            _searchResult.style.display = '';
            _instance.events.onPostSearchResults.fire(_instance, eventArgs);
        }

        function createSearchResult(text)
        {
            if (!_searchResult)
                _searchResult = createElement(_instance.element, 'div', _instance.getCssClass(_classOption.SEARCH_RESULT));

            _searchResult.innerHTML = text;
        }

        function getSearchCategory(route)
        {
            if (route.indexOf('/') == -1)
                return _instance.searchCategoryLabels[''] || '';

            let cat = route.substr(0, route.lastIndexOf('/'));
            return _instance.searchCategoryLabels[cat] || cat;
        }

        function hideAll()
        {
            hide([_login, _page, _view, _error]);
            $lib.removeClass(_instance.element, `${_instance.getCssClass(_classOption.LOGIN)} ${_instance.getCssClass(_classOption.ERROR)}`);
            _activeScreen = _screenOption.PAGE;

            if (!_launch && _instance.menuType != _menuTypeOption.SIDEMENU)
            {
                _mainMenu?.hide();
                _menuButton?.deselect();
            }

            if (_topbar && !_instance.persistentTopBar)
            {
                _topbar.style.display = 'none';
                $lib.removeClass(_instance.element, _instance.getCssClass(_classOption.TOPBAR));
            }

            if (_instance.footerDisplay != _footerDisplayOption.PERSISTENT && _footer)
                hideFooter();
        }

        function hide(elements)
        {
            for (let index = 0; index < elements.length; ++index)
            {
                if (elements[index])
                    elements[index].style.display = 'none';
            }
        }

        function toggleMenu()
        {
            if (_activeScreen == _screenOption.PORTAL && _launch)
                return; // only switch back to page when the menu was clicked

            if (menuIsShowing())
                hideMenu();
            else
                showMenu();
        }

        function showMenu(instant)
        {
            if (!instant && menuIsShowing())
                return;

            if (_instance.menuType == _menuTypeOption.PORTALMENU)
            {
                hideAll();
                _activeScreen = _screenOption.PORTAL; // page is not visible with portal-menu
                document.documentElement.style.overflow = "hidden"; // temporary disable scrollbar otherwise browser calculates available space for portal-menu with vertical-scrollbar
                _mainMenu.show(); // portal-menu display is always instant
                resize();
            }
            else
            {
                _instance.showPage(); // page is visible with side-menu
                _sideMenuBox.show(instant || _launch); // without animation when launching
            }

            if (_instance.footerDisplay == _footerDisplayOption.MENU)
                showFooter();

            $lib.addClass(_instance.element, (_instance.menuType == _menuTypeOption.PORTALMENU) ? _instance.getCssClass(_classOption.PORTAL_MENU) : _instance.getCssClass(_classOption.SIDE_MENU));

            if (_menuButton)
            {
                if (!_menuButton.showing)
                    _menuButton.show();

                _menuButton.select();
            }

            _instance.events.onShowMenu.fire(_instance);
        }

        function hideMenu(instant, hideFn)
        {
            if (!instant && !menuIsShowing() || (_launch && _instance.launchMenu))
                return;

            if (hideFn)
                setHideMenuCallback(function () { showMainCategory(); });

            _instance.events.onHideMenu.fire(_instance);
            _instance.showPage(); // hides the portal-menu

            if (isSideMenu()) // side-menu is not automatically hidden
            {
                _menuButton.deselect();
                _sideMenuBox.hide(instant);
            }
        }

        function menuIsShowing()
        {
            return ((isSideMenu() && _sideMenuBox.showing) || (!isSideMenu() && _mainMenu.showing));
        }

        function isSideMenu()
        {
            return (_instance.menuType === _menuTypeOption.SIDEMENU);
        }

        function showFooter()
        {
            _footer.style.display = '';
            $lib.addClass(_instance.element, _instance.getCssClass(_classOption.FOOTER));
        }

        function hideFooter()
        {
            _footer.style.display = 'none';
            $lib.removeClass(_instance.element, _instance.getCssClass(_classOption.FOOTER));
        }

        function showLogin()
        {
            if (isSideMenu())
                hideMenu();

            hideAll();

            if (_instance.hideMenuButtonOnLogin)
                _menuButton?.hide();

            _login.style.display = '';
            _activeScreen = _screenOption.LOGIN;
            $lib.addClass(_instance.element, _instance.getCssClass(_classOption.LOGIN));
            _user.focus();
            _pass.type = 'password';

            _instance.events.onShowLogin.fire(_instance);
        }

        function showLoginVerification()
        {
            if (isSideMenu())
                hideMenu();

            hideAll();
            _loginVerification.style.display = '';
            _activeScreen = _screenOption.LOGIN_VERIFICATION;
            $lib.addClass(_instance.element, `${_instance.getCssClass(_classOption.LOGIN)} ${_instance.getCssClass(_classOption.VERIFICATION)}`);
            _verificationCode.focus();

            _instance.events.onShowLoginVerification.fire(_instance);
        }

        function login(settings)
        {
            if (!settings)
                settings = { crsfToken: _instance.crsfToken, username: _user.value, password: _pass.value, persistent: (_remember) ? _remember.checked : false };

            invokeAuthenticationMiddleware(settings, function (args)
            {
                args.data.cancel = false;
                _instance.events.onLoginAttempt.fire(_instance, args.data);

                if (args.data.cancel === true) // we don't have to handle this further (custom handeling of args.data.redirectPath)
                    return;

                if (!args.data.authenticationState)
                {
                    authenticationFailed([_pass], args.data, _loginFailedMessage);
                }
                else if (args.data.authenticationState == componyx.UI.AppSkin.AuthenticationStateOption.CREDENTIALS_VALIDATED)
                {
                    if (args.data.redirectPath) // not handled in login attempt event
                    {
                        if (_instance.useBindary && $bindary && $bindary.routes && $bindary.routes.length) // we only handle default route behaviour
                            $bindary.loadRoute(args.data.redirectPath);
                    }
                    else
                    {
                        _instance.showLoginVerification();
                    }
                }
                else
                {
                    window.location.reload();
                }
            });
        }

        function verifyCode(settings)
        {
            if (!settings)
                settings = { crsfToken: _instance.crsfToken, verificationCode: _verificationCode.value };

            invokeAuthenticationMiddleware(settings, function (args)
            {
                args.data.cancel = false;
                _instance.events.onLoginVerificationAttempt.fire(_instance, args.data);

                if (args.data.cancel === true) // we don't have to handle this further
                    return;

                if (!args.data.authenticationState)
                {
                    let reason = args.data.failureReason;
                    authenticationFailed([_verificationCode], args.data, _verificationFailedMessage);

                    if (reason == _failureReasonOption.VERIFICATION_CODE_EXPIRED || reason == _failureReasonOption.MAX_VERIFY_ATTEMPTS_EXCEEDED)
                        setTimeout(function () { window.location.reload(); }, _instance.verificationFailedReloadDelay);

                }
                else if (args.data.authenticationState == componyx.UI.AppSkin.AuthenticationStateOption.AUTHENTICATED)
                {
                    window.location.reload();
                }
            });
        }

        function logout(settings)
        {
            if (!settings)
                settings = { signout: true };

            invokeAuthenticationMiddleware(settings, function (args)
            {
                args.data.cancel = false;
                _instance.events.onLogout.fire(_instance, args.data);

                if (args.data.cancel === true) // we don't have to handle this further
                    return;

                if (args.data && args.data.failureMessage)
                    $lib.log(args.data.failureMessage);

                window.location.reload();
            });
        }

        function authenticationFailed(inputs, data, messageElement)
        {
            let label = getAuthenticationFailureLabel(data.failureReason);

            if (messageElement)
                messageElement.innerHTML = data.failureMessage || label || '';

            inputs.forEach((input) =>
            {
                input.value = '';
            });

            inputs[0].focus();

            let logMessage = 'Authentication failed. ';

            if (data.failureReason)
                logMessage += `Reason: ${_failureReasonOption.getName(data.failureReason)}. `;

            if (data.failureMessage)
                logMessage += `Message: ${data.failureMessage}.`;

            $lib.log(logMessage);
        }

        function getAuthenticationFailureLabel(reason)
        {
            if ($lib.isEmpty(reason))
                return _instance.authenticationFailureLabel;
            else
                return _instance.authenticationFailureReasonLabels[reason];
        }

        function invokeAuthenticationMiddleware(settings, onSuccess)
        {
            _instance.ajaxCall('authenticate', settings, { onSuccess: onSuccess });
        }

        function updateMenuButtonVisibility()
        {
            if (!_menuButton)
                return;

            let shouldShow = _instance.persistentMenuButton
                || !_allInHeader
                || $lib.hasClass(_instance.element, _instance.getCssClass(_classOption.HEADER_MENU_HIDDEN))
                || !$lib.isEmpty(_mainMenu?.getActiveCategoryId());

            if (shouldShow && !_menuButton.showing)
                _menuButton.show();
            else if (!shouldShow && _menuButton.showing)
                _menuButton.hide();
        }


        function resize(e)
        {
            clearTimeout(_resizeTimerId);
            _resizeTimerId = setTimeout(function ()
            {
                let docStyle = document.documentElement.style;

                checkHeaderOverflow(e);
                docStyle.overflow = "";
            }, 0);
        }

        function checkHeaderOverflow()
        {
            if (!_headerMenu || !_headerMenu.itemList.length)
            {
                headerOverflowCheckComplete();
                return;
            }

            clearTimeout(_headerOverflowTimerId);

            if (_allInHeader)
                $lib.addClass(_instance.element, _instance.getCssClass(_classOption.HEADER_ALL));

            _headerOverflowTimerId = setTimeout(function ()
            {
                _headerMenu.show();

                let nav = $lib(null, _headerMenu.element, 'nav', true), topbarDisplay = null;

                if (!nav)
                    return;

                if (_topbar && $lib.contains(_topbar, _headerMenu.element)) // header menu in topbar
                {
                    topbarDisplay = _topbar.style.display || '';
                    _topbar.style.display = ''; // display topbar for overflow calculation
                }

                let fits = (nav.scrollWidth == nav.clientWidth),
                    cssClass = _instance.getCssClass(_classOption.HEADER_OVERFLOW), el = _instance.element, retry,
                    hasClass = $lib.hasClass(el, cssClass),
                    obj = { headerOverflow: !fits, cancel: false };

                _instance.events.onResize.fire(_instance, obj);

                if (obj.cancel !== true)
                {
                    if (fits)
                    {
                        let hasRoutes = _instance.useBindary && $bindary && $bindary.routes && $bindary.routes.length > 0;
                        $lib.removeClass(el, _instance.getCssClass(_classOption.HEADER_MENU_HIDDEN));

                        if (_instance.menuType == _menuTypeOption.SIDEMENU && _allInHeader && (!_launch || !hasRoutes) && $lib.isEmpty(_mainMenu.getActiveCategoryId()))
                        {
                            updateMenuButtonVisibility();
                            hideMenu(true);
                        }
                    }
                    else
                        _headerMenu.hide();

                    if (!fits && hasClass)
                    {
                        $lib.addClass(el, _instance.getCssClass(_classOption.HEADER_MENU_HIDDEN));

                        if (_menuButton && !_menuButton.showing)
                            _menuButton.show();
                    }
                    else if (!fits)
                    {
                        $lib.addClass(el, cssClass);
                        _windowWidth = $lib.getWindowSize().width; // store window width to detect turning point
                        retry = true; // check if the header overflows when the overflow class is applied
                    }
                    else if (fits && hasClass && $lib.getWindowSize().width > _windowWidth) // change in window size (turning point)
                    {
                        $lib.removeClass(el, cssClass);

                        if (nav.scrollWidth != nav.clientWidth)
                            $lib.addClass(el, cssClass);
                        else
                            retry = true; // check if the header overflows when the overflow class is removed
                    }
                }

                if (topbarDisplay != null)
                    _topbar.style.display = topbarDisplay;

                if (retry)
                    checkHeaderOverflow();
                else
                    headerOverflowCheckComplete()
            }, 0);
        }

        function headerOverflowCheckComplete()
        {
            if (_instance.useBindary && $bindary && $bindary.routes && $bindary.routes.length > 0)
                return; // Bindary's own route load will clear _launch instead

            _launch = false;
        }

        function detectMenuToggle(e)
        {
            let src = $lib.eventSource(e);

            if (src == _menuButton.element || $lib.contains(_menuButton.element, src) || src == _mainMenu.element || $lib.contains(_mainMenu.element, src))
                return;

            if (_sideMenuBox.showing)
                hideMenu();
        }

        function hideSearchResult(e)
        {
            let target = e.target;

            if (!_searchResult)
                return;

            if (target.nodeName.toLowerCase() == 'a' || (target != _searchBox && target != _searchBox.parentNode && target != _searchResult && !$lib.contains(_searchResult, target)))
                _searchResult.style.display = 'none';
        }

        function dispose()
        {
            $lib.off(window, 'resize', resize);
            $lib.off(_instance.element, 'click', detectMenuToggle);
            $lib.off(document, 'click', hideSearchResult);
        }
    }

    /**
    * @see {@link componyx.UI.base.methods}
    */
    componyx.UI.AppSkin.prototype = Object.create($base.methods);
    componyx.UI.AppSkin.prototype.constructor = componyx.UI.AppSkin;

    /**
    * ScreenOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.AppSkin.ScreenOption =
    {
        /** the login screen is visible */
        LOGIN: 0,
        /** the login verification screen is visible */
        LOGIN_VERIFICATION: 1,
        /** the portal navigation screen is visible */
        PORTAL: 2,
        /** the page is visible */
        PAGE: 3
    }

    /**
    * MenuTypeOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.AppSkin.MenuTypeOption =
    {
        /** the main menu is displayed as portal navigation */
        PORTALMENU: 0,
        /** the main menu is displayed as side navigation */
        SIDEMENU: 1
    }

    /**
    * MenuSectionOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.AppSkin.MenuSectionOption =
    {
        /** the menu-item will be rendered in the header and main menu-sections */
        HEADER: 0,
        /** the menu-item will be rendered in the main menu-section */
        MAIN: 1,
        /** the menu-item will be rendered in the footer menu-section */
        FOOTER: 2,
        /** the menu-item will be rendered in the quick-launch menu-section */
        QUICKLAUNCH: 3
    }

    /**
    * ButtonTileSizeOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.AppSkin.TileSizeOption =
    {
        /** renders the menu-item button as small tile in the portal-menu */
        SMALL: 1,
        /** renders the menu-item button as small-wide tile in the portal-menu */
        SMALL_WIDE: 2,
        /** renders the menu-item button as medium tile in the portal-menu */
        MEDIUM: 4,
        /** renders the menu-item button as medium-wide tile in the portal-menu */
        MEDIUM_WIDE: 8,
        /** renders the menu-item button as large tile in the portal-menu */
        LARGE: 16,

        getName: function (value) { return $base.static.getKeyByValue(this, value).toLowerCase(); }
    }

    /**
    * RoutePathMatchingOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.AppSkin.RoutePathMatchingOption =
    {
        /** there is no menu-item route-path matching */
        DISABLED: 0,
        /** matches if the item's route-path equals the current URL route-path exactly  */
        EXACT: 1,
        /** matches if the item's route-path equals the current URL route-path while ignoring possible parameters preceded by a question mark character. */
        PARTIAL: 2
    }

    /**
    * FooterDisplayOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.AppSkin.FooterDisplayOption =
    {
        /** the footer is not visible */
        DISABLED: 0,
        /** the footer is visible when the menu is visible */
        MENU: 1,
        /** the footer is always visible */
        PERSISTENT: 2
    }

    /**
    * FailureReasonOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.AppSkin.FailureReasonOption =
    {
        /** Provided CRSF Token does not match with token in Session object. */
        CRSF_TOKEN_MISMATCH: 0,
        /**  Total attempts exceeded configured max sign-in attempts. */
        MAX_SIGNIN_ATTEMPTS_EXCEEDED: 1,
        /**  Provided username and/or password do not match. */
        USERNAME_OR_PASSWORD_MISMATCH: 2,
        /** Provided verificatin code does not match.*/
        VERIFICATION_CODE_MISMATCH: 3,
        /** The generated verification-code has expired.*/
        VERIFICATION_CODE_EXPIRED: 4,
        /** Total attempts exceeded the configured max verify code attempts.*/
        MAX_VERIFY_ATTEMPTS_EXCEEDED: 5,
        /**  Other reason */
        OTHER: 6,

        getName: function (value) { return $base.static.getKeyByValue(this, value).toLowerCase(); }
    }

    /**
    * AuthenticationStateOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.AppSkin.AuthenticationStateOption =
    {
        /** The user is not authenticated. */
        UNAUTHENTICATED: 0,
        /** The credentials have been successfully validated but the user is not yet authenticated (Step 1 in Two-Factor authentication). */
        CREDENTIALS_VALIDATED: 1,
        /** The user is successfully authenticated. */
        AUTHENTICATED: 2
    }

    /** 
    * Creates an instance of the AppSkin MenuItem.
    * @class
    * @param {Object} properties The properties used to initialize the object.
    * @property {componyx.UI.AppSkin.MenuSectionOption} menuSection=HEADER Gets or sets a value indicating in which menu-section the item is displayed.
    * @property {componyx.UI.AppSkin.TileSizeOption} groupTileSize Gets or sets the tile-size of the portal menu group.
    * @property {componyx.UI.AppSkin.TileSizeOption} buttonTileSize=MEDIUM Gets or sets the tile-size of the portal menu buttons.
    * @property {Boolean} categoryInHeader Gets or sets a value indicating if the category (isCategory:true) is shown in the header-menu when menuSection:HEADER. By default the category is always displayed in the main-menu.
    * @augments componyx.UI.Menu.Item
    * @see {@link componyx.UI.Menu.Item}
    * @see {@link componyx.UI.base.Item}
    */
    componyx.UI.AppSkin.MenuItem = function (properties)
    {
        this.menuSection = componyx.UI.AppSkin.MenuSectionOption.HEADER;
        this.groupTileSize = null;
        this.buttonTileSize = componyx.UI.AppSkin.TileSizeOption.MEDIUM;
        this.categoryInHeader = false;
        componyx.UI.Menu.Item.call(this, properties);
    }
})(window);