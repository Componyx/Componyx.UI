declare namespace componyx 
{
    namespace UI
    {
        interface AppSkin extends componyx.UI.base.methods { }

        /**
         * <p>AppSkin class.</p>
         */
        class AppSkin extends componyx.UI.base.Component implements componyx.UI.base.methods
        {
            /**
             * Creates a new AppSkin instance.
             * @param id - <p>The id of the component.</p>
             * @param properties - <p>The properties used to initialize the component or the container element.</p>
             */
            constructor(id: string, properties: Partial<AppSkin> | HTMLElement);
            ajax: componyx.UI.base.Component['ajax'] & {
                /**
                 * <p>AJAX method used to authenticate.</p>
                 */
                authenticate: componyx.UI.base.AjaxMethod;

                /**
                 * <p>AJAX method used to load search results.</p>
                 */
                search: componyx.UI.base.AjaxMethod;
            };
            /**
             * <p>AppSkin events</p>
             */
            events: componyx.UI.AppSkin.AppSkinEvents;
            /**
             * <p>Internal CSS class name constants. You can override any of these classes on the Component instance by defining a property named
             * <code>cssClass&lt;Key&gt;</code> where &lt;Key&gt; is the PascalCase key from this object (e.g. 'SEARCH_RESULT' -&gt; 'cssClassSearchResult').
             * Be cautious: overriding these classes without including the default names may break styling and functionality.</p>
             */
            readonly classOption: Readonly<{
                FULL: 'full';
                ERROR: 'error';
                TOPBAR: 'topbar';
                FOOTER: 'footer';
                REQUIRED: 'required';
                MENU_LEFT: 'menu-left';
                AUTHENTICATED: 'authenticated';
                SEARCH_ACTIVE: 'search-active';
                PORTAL_MENU: 'portal-menu';
                SIDE_MENU: 'side-menu';
                LOGIN: 'login';
                VERIFICATION: 'verification';
                HEADER_ALL: 'header-all';
                HEADER_MENU_HIDDEN: 'header-menu-hidden';
                HEADER_OVERFLOW: 'header-overflow';
                BODY: 'body';
                PAGE: 'page';
                VIEW: 'view';
                OVERLAY: 'overlay';
                SIDEBAR: 'sidebar';
                APP_CONTENT: 'app-content';
                SEARCH: 'search';
                SEARCH_RESULT: 'search-result';
                SPINNER: 'spinner';
                BOX: 'box';
                PRELOADER: 'preloader';
                MENU: 'menu';
                MAIN: 'main';
                SIDE: 'side';
                PORTAL: 'portal';
                HEADER_MENU: 'header-menu';
                QUICK_LAUNCH: 'quick-launch';
                FOOTER_MENU: 'footer-menu';
                BUTTON: 'button';
                MENU_BUTTON: 'menu-button';
                ACCOUNT: 'account';
                ACCOUNT_AVATAR: 'account-avatar';
                NO_ACTION: 'no-action';
                SUB_GROUP: 'sub-group';
                ROW_START: 'row-start';
                SHADE: 'shade';
                LOGIN_SCREEN: 'login-screen';
                LOGIN_VERIFICATION: 'login-verification';
                CONTENT: 'content';
                USER: 'user';
                PASS: 'pass';
                REMEMBER: 'remember';
                CODE: 'code';
                MESSAGE: 'message';
                ICON_MENU: 'ico-menu ico-m';
                ICON_USER: 'ico-user';
                ICON_LOCK: 'ico-lock';
                ICON_KEY: 'ico-key';
                ICON_EYE: 'ico-eye';
                ICON_EYE_BLOCKED: 'ico-eye-blocked';
            }>;
            /**
             * <p>Gets the css class if it exists and otherwise the default css class.</p>
             * @param cssClassValue - <p>The default css class (a value of the classOption object).</p>
             * @returns <p>The css class.</p>
             */
            getCssClass(cssClassValue: string): string;
            /**
             * <p>Sets the header template. This template supports the below listed interpolations. Default value: {logo}{quickLaunchMenu}{menuButton}{topbar}{menu}{/topbar}</p>
             * <ul>
             * <li>{topbar} This value will be replaced with the opening topbar element tag.</li>
             * <li>{/topbar} This value will be replaced with the closing topbar element tag.</li>
             * <li>{logo} This value will be replaced with the figure element.</li>
             * <li>{menuButton} This value will be replaced with the menu button.</li>
             * <li>{accountButton} When authenticated this value will be replaced with the account button otherwise it will open the login screen.</li>
             * <li>{menu} This value will be replaced with the header menu, containing all menu-items with menuSection set to either MAIN_HEADER or HEADER.</li>
             * <li>{quickLaunchMenu} This value will be replaced with the quick-launch menu, containing all menu-items with menuSection set to QUICKLAUNCH</li>
             * <li>{username} This value will be replaced with the username of the logged in user.</li>
             * <li>{searchBox} This value will be replaced with the search-box.</li>
             * </ul>
             * @param content - <p>The HTML template.</p>
             */
            setHeaderTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the footer template. This template supports the below listed interpolations. Default value: {menu}{username}{loginButton}</p>
             * <ul>
             * <li>{logo} This value will be replaced with the figure element.</li>
             * <li>{accountButton} When authenticated this value will be replaced with the account button otherwise it will open the login screen.</li>
             * <li>{menu} This value will be replaced with the footer menu, containing all menu-items with menuSection set to FOOTER.</li>
             * <li>{quickLaunchMenu} This value will be replaced with the quick-launch menu, containing all menu-items with menuSection set to QUICKLAUNCH</li>
             * <li>{username} This value will be replaced with the username of the logged in user.</li>
             * <li>{searchBox} This value will be replaced with the search-box.</li>
             * </ul>
             * @param content - <p>The HTML template.</p>
             */
            setFooterTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the sidebar template. This template supports the below listed interpolations.</p>
             * <ul>
             * <li>{logo} This value will be replaced with the figure element.</li>
             * <li>{menuButton} This value will be replaced with the menu button.</li>
             * <li>{accountButton} When authenticated this value will be replaced with the account button otherwise it will open the login screen.</li>
             * <li>{quickLaunchMenu} This value will be replaced with the quick-launch menu, containing all menu-items with menuSection set to QUICKLAUNCH</li>
             * <li>{username} This value will be replaced with the username of the logged in user.</li>
             * <li>{searchBox} This value will be replaced with the search-box.</li>
             * </ul>
             * @param content - <p>The HTML template.</p>
             */
            setSidebarTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the login template. This template supports the below listed interpolations. Default value: {logo}{username}{password}{rememberMe}{loginButton}{failedMessage}</p>
             * <ul>
             * <li>{logo} This value will be replaced with the figure element.</li>
             * <li>{username} This value will be replaced with the username input field.</li>
             * <li>{password} This value will be replaced with the password input field.</li>
             * <li>{rememberMe} This value will be replaced with the remember-me checkbox.</li>
             * <li>{loginButton} This value will be replaced with the login button.</li>
             * <li>{failedMessage} This value will be replaced with the message displayed when a login attempt failed.</li>
             * </ul>
             * @param content - <p>The HTML template.</p>
             */
            setLoginTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the login verification template. This template supports the below listed interpolations. Default value: {logo}{verificationCode}{verificationButton}{failedMessage}</p>
             * <ul>
             * <li>{logo} This value will be replaced with the figure element.</li>
             * <li>{verificationCode} This value will be replaced with the verification-code input field.</li>
             * <li>{verificationButton} This value will be replaced with the verification button.</li>
             * <li>{failedMessage} This value will be replaced with the message displayed when a verification attempt failed.</li>
             * </ul>
             * @param content - <p>The HTML template.</p>
             */
            setLoginVerificationTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the error template. The error template supports the below listed interpolations.</p>
             * <ul>
             * <li>{message} This value will be replaced with the error message.</li>
             * <li>{timestamp} This value will be replaced with the error timestamp (optional).</li>
             * <li>{id} This value will be replaced with the error identifier (optional).</li>
             * <li>{stackTrace} This value will be replaced with the error stack trace (optional).</li>
             * </ul>
             * @param content - <p>The HTML template.</p>
             */
            setErrorTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the page header template.</p>
             * @param content - <p>The HTML template.</p>
             */
            setPageHeaderTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the page footer template.</p>
             * @param content - <p>The HTML template.</p>
             */
            setPageFooterTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets a value indicating if the app skin utilizes the full width of the screen.</p>
             * @param value - <p>A value indicating if the appskin utilizes the full width of the screen.</p>
             */
            setFullscreen(value: boolean): void;
            /**
             * <p>Sets a value indicating if the page content utilizes the full-screen width when not in full-screen mode.</p>
             * @param value - <p>A value indicating if the page content container utilizes the full width of the screen.</p>
             */
            setFullpage(value: boolean): void;
            /**
             * <p>Shows the intial page based upon the defined properties.</p>
             */
            launch(): void;
            /**
             * <p>Updates the menu state to the active route path. The corresponding menu items are selected / expanded based on the menuRoutePathMatching setting.</p>
             * @param routePath - <p>The active route path. The route path may end with a page anchor.</p>
             * @param [hashtagRoutes] - <p>A value indicating if hashtag routes are used, in other words, the route-path follows the first hashtag.</p>
             */
            updateMenuState(routePath: string, hashtagRoutes?: string): void;
            /**
             * <p>Gets the active screen.</p>
             * @returns <p>The active screen.</p>
             */
            activeScreen(): componyx.UI.AppSkin.ScreenOption;
            /**
             * <p>Gets the main menu.</p>
             * @returns <p>The main menu component.</p>
             */
            getMainMenu(): componyx.UI.Menu;
            /**
             * <p>Gets the header menu.</p>
             * @returns <p>The header menu component.</p>
             */
            getHeaderMenu(): componyx.UI.Menu;
            /**
             * <p>Gets the footer menu.</p>
             * @returns <p>The footer menu component.</p>
             */
            getFooterMenu(): componyx.UI.Menu;
            /**
             * <p>Gets the quick-launch menu.</p>
             * @returns <p>The quick-launch menu component.</p>
             */
            getQuickLaunchMenu(): componyx.UI.Menu;
            /**
             * <p>Gets the preloader.</p>
             * @returns <p>The preloader box component.</p>
             */
            preloader(): componyx.UI.Box;
            /**
             * <p>Shows the login page.</p>
             */
            showLogin(): void;
            /**
             * <p>Shows the login verification page.</p>
             */
            showLoginVerification(): void;
            /**
             * <p>Toggles the display of the main menu.</p>
             */
            toggleMenu(): void;
            /**
             * <p>Shows the main menu.</p>
             * @param [instant] - <p>A value indicating if the menu should be shown instantly without animation. Only applicable for side menu.</p>
             */
            showMenu(instant?: boolean): void;
            /**
             * <p>Hides the main menu.</p>
             * @param [instant] - <p>A value indicating if the menu should be shown instantly without animation. Only applicable for side menu.</p>
             */
            hideMenu(instant?: boolean): void;
            /**
             * <p>Processes the header overflow tasks.</p>
             */
            checkHeaderOverflow(): void;
            /**
             * <p>Shows the page.</p>
             * @param hideError - <p>Hides the error screen if active.</p>
             */
            showPage(hideError: boolean): void;
            /**
             * <p>Checks if the error screen is active.</p>
             * @returns <p>A value indicating if an error occurred.</p>
             */
            hasError(): boolean;
            /**
             * <p>Initiates a search request.</p>
             * @param terms - <p>The search terms.</p>
             */
            search(terms: string): void;
            /**
             * <p>Log's the user in.</p>
             * @param [settings] - <p>The login settings to send to the authentication handler. By default input values (string username, string password, boolean persistent) from the login-screen are sent to the authentication handler.</p>
             */
            login(settings?: any): void;
            /**
             * <p>Verifies the login verification code.</p>
             * @param [settings] - <p>The login settings to send to the authentication handler. By default the input value (string verificationCode) from the login-verification-screen is sent to the authentication handler.</p>
             */
            verifyCode(settings?: any): void;
            /**
             * <p>Log's the user out.</p>
             * @param [settings] - <p>The logout settings to send to the authentication handler. By default boolean logout:true is sent to the authentication handler.</p>
             */
            logout(settings?: any): void;
            /**
             * <p>Renders the component</p>
             */
            render(): Promise<void>;
            /**
             * <p>Handles the post render procedure.</p>
             */
            postRender(): void;
            /**
             * <p>Destroys the component.</p>
             * @param keepEvents - <p>A value indicating if the events must be kept.</p>
             * @param [removeElement = true] - <p>A value indicating if the element must be removed.</p>
             */
            destroy(keepEvents: boolean, removeElement?: boolean): void;
            /**
             * <p>Gets or sets a value indicating if authentication is required.</p>
            */
            authenticationRequired: boolean;
            /**
             * <p>Gets a value indicating if the user is authenticated.</p>
            */
            authenticated: boolean;
            /**
             * <p>Gets a value indicating if the menu is displayed on app launch.</p>
            */
            launchMenu: boolean;
            /**
             * <p>Gets a value indicating if the menu button is displayed when the app-skin login page is active.</p>
            */
            hideMenuButtonOnLogin: boolean;
            /**
             * <p>Gets or sets a value indicating if the contents of the app skin will utilize the full-screen width.</p>
            */
            fullscreen: boolean;
            /**
             * <p>Gets or sets a value indicating if the page content utilizes the full-screen width when not in full-screen mode.</p>
            */
            fullpage: boolean;
            /**
             * <p>Gets or sets a value indicating if the rememeber me option is available for manual login.</p>
            */
            showRememberMe: boolean;
            /**
             * <p>Gets or sets a value indicating if the top-bar in the header is always visible (true) or is hidden when the portal-menu is active (false).</p>
            */
            persistentTopBar: boolean;
            /**
             * <p>Gets or sets a value indicating if the menu button is always visible (true) or is hidden when the all menu-items are visible in the header-menu.</p>
            */
            persistentMenuButton: boolean;
            /**
             * <p>Gets or sets a value indicating if the side-menu displays at the right side (false) or the left side (true) of the screen.</p>
            */
            menuLeft: boolean;
            /**
             * <p>Gets or sets a value indicating if the account button is displayed as avatar when the user is authenticated.</p>
            */
            accountButtonAvatar: boolean;
            /**
             * <p>Gets or sets a value indicating if the login template is created when rendering the app skin.</p>
            */
            useLoginTemplate: boolean;
            /**
             * <p>Gets or sets a value indicating if the Bindary framework is used for loading routes.</p>
            */
            useBindary: boolean;
            /**
             * <p>Gets or sets the menu navigation type (portal-menu or side-menu).</p>
            */
            menuType: componyx.UI.AppSkin.MenuTypeOption;
            /**
             * <p>Gets or sets a value indicating if menu-items are automatically selected if the item's route-path (partially) matches the current URL route-path.</p>
            */
            menuRoutePathMatching: componyx.UI.AppSkin.RoutePathMatchingOption;
            /**
             * <p>Gets or sets a value indicating when the footer is displayed.</p>
            */
            footerDisplay: componyx.UI.AppSkin.FooterDisplayOption;
            /**
             * <p>Gets or sets the delay in milliseconds before the typed letter(s) in the search-box are sent to the server.</p>
            */
            searchDelay: number;
            /**
             * <p>Gets or sets the search-box placeholder label.</p>
            */
            searchLabel: string;
            /**
             * <p>Gets or sets the label when no search results are found.</p>
            */
            searchNoResultLabel: string;
            /**
             * <p>Gets or sets the category labels for the search-results. Use empty string key for root label.</p>
            */
            searchCategoryLabels: any;
            /**
             * <p>Gets or sets the action of the account button.</p>
            */
            accountAction: ((...params: any[]) => any) | string;
            /**
             * <p>Gets or sets the account button avatar initials.</p>
            */
            avatarInitials: string;
            /**
             * <p>Gets or sets the account button avatar image path.</p>
            */
            avatarImagePath: string;
            /**
             * <p>Gets or sets the Loading text label.</p>
            */
            loadingLabel: string;
            /**
             * <p>Gets or sets the text label of the main category.</p>
            */
            mainCategoryLabel: string;
            /**
             * <p>Gets or sets the username of the authenticated user.</p>
            */
            username: string;
            /**
             * <p>Gets or sets the Username text label.</p>
            */
            usernameLabel: string;
            /**
             * <p>Gets or sets the Password text label.</p>
            */
            passwordLabel: string;
            /**
             * <p>Gets or sets the RememberMe text label.</p>
            */
            rememberMeLabel: string;
            /**
             * <p>Gets or sets the text label of the login button.</p>
            */
            loginButtonLabel: string;
            /**
             * <p>Gets or sets the default label for an authentication failure.</p>
            */
            authenticationFailureLabel: string;
            /**
             * <p>Gets or sets the labels for the authentication failure reasons.</p>
            */
            authenticationFailureReasonLabels: String[];
            /**
             * <p>Gets or sets the text label of the login-verification button.</p>
            */
            verificationButtonLabel: string;
            /**
             * <p>Gets or sets the text label of the login verification code.</p>
            */
            verificationCodeLabel: string;
            /**
             * <p>Gets or sets the input field length of the login verification code.</p>
            */
            verificationCodeLength: number;
            /**
             * <p>Gets or sets the delay in milliseconds before the app is reloaded when the login verification failed.</p>
            */
            verificationFailedReloadDelay: number;
            /**
             * <p>Gets or sets the CRSF Token to send with autorisation POST actions.</p>
            */
            crsfToken: string | null;
            /**
             * <p>Gets or sets the list of menu-items.</p>
            */
            menu: componyx.UI.AppSkin.MenuItem[];
            /**
             * <p>Gets or sets the id of the menu component used as base for the main menu.</p>
            */
            mainMenuId: string | null;
            /**
             * <p>Gets or sets the id of the menu component used as base for the header menu.</p>
            */
            headerMenuId: string | null;
            /**
             * <p>Gets or sets the id of the menu component used as base for the footer menu.</p>
            */
            footerMenuId: string | null;
            /**
             * <p>Gets or sets the id of the menu component used as base for the quick launch menu.</p>
            */
            quickLaunchMenuId: string | null;
            /**
             * <p>Gets or sets the id of the button component used as base for the menu button.</p>
            */
            menuButtonId: string | null;
            /**
             * <p>Gets or sets the id of the button component used as base for the login button.</p>
            */
            loginButtonId: string | null;
            /**
             * <p>Gets or sets the id of the button component used as base for the login-verification button.</p>
            */
            verificationButtonId: string | null;
            /**
             * <p>Gets or sets the id of the button component used as base for the account button.</p>
            */
            accountButtonId: string | null;
            /**
             * <p>Gets or sets the id of the form-field component used as base for the username form field.</p>
            */
            usernameFormFieldId: string | null;
            /**
             * <p>Gets or sets the id of the form-field component used as base for the password form field.</p>
            */
            passwordFormFieldId: string | null;
            /**
             * <p>Gets or sets the id of the form-field component used as base for the remember-me form field.</p>
            */
            rememberMeFormFieldId: string | null;
            /**
             * <p>Gets or sets the id of the form-field component used as base for the verification code form field.</p>
            */
            verificationCodeFormFieldId: string | null;
        }
        namespace AppSkin
        {
            /**
             * @property authenticationState - <p>The authentication state.</p>
             * @property failureReason - <p>The reason why the authentication attempt failed.</p>
             * @property failureMessage - <p>The failure message.</p>
             * @property [cancel = false] - <p>A value indicating if the default action of the AppSkin component should be canceled.</p>
             */
            type AuthenticationResponseEventArgs = {
                authenticationState: AuthenticationStateOption;
                failureReason: FailureReasonOption;
                failureMessage: string;
                cancel?: boolean;
            };
            /**
             * @property headerOverflow - <p>A value indicating if the content in the header caused an overflow.</p>
             * @property [cancel = false] - <p>A value indicating if the default action of the AppSkin component should be canceled.</p>
             */
            type ResizeActionEventArgs = {
                headerOverflow: boolean;
                cancel?: boolean;
            };
            /**
             * @property data - <p>The search results.</p>
             * @property container - <p>The search results container element.</p>
             * @property [cancel = false] - <p>A value indicating if the default action of the AppSkin component should be canceled.</p>
             */
            type SearchResultsEventArgs = {
                data: object[];
                container: HTMLElement;
                cancel?: boolean;
            };
            /**
             * @property data - <p>The search results.</p>
             * @property container - <p>The search results container element.</p>
             * @property [anchor] - <p>The seach result element.</p>
             * @property [item] - <p>The seach result item.</p>
             */
            type SearchResultEventArgs = {
                data: object[];
                container: HTMLElement;
                anchor?: HTMLElement;
                item?: any;
            };
            /**
             * @property onShowLogin - <p>Event which fires when the login-screen is shown.</p>
             * @property onShowLoginVerification - <p>Event which fires when the login-verification-screen is shown.</p>
             * @property onShowPage - <p>Event which fires when the page-screen is shown.</p>
             * @property onShowError - <p>Event which fires when the error-screen is shown.</p>
             * @property onShowMenu - <p>Event which fires when the menu is shown.</p>
             * @property onHideMenu - <p>Event which fires when the menu is hidden.</p>
             * @property onLoginAttempt - <p>Event which fires when a login attempt is made. The event arguments are of type {@link componyx.UI.AppSkin.AuthenticationResponseEventArgs}.</p>
             * @property onLoginVerificationAttempt - <p>Event which fires when a login verification attempt is made. The event arguments are of type {@link componyx.UI.AppSkin.AuthenticationResponseEventArgs}.</p>
             * @property onLogout - <p>Event which fires when the user logged out. The event arguments are of type {@link componyx.UI.AppSkin.AuthenticationResponseEventArgs}.</p>
             * @property onPreSearchResults - <p>Event which fires before the search results are rendered. The event arguments are of type {@link componyx.UI.AppSkin.SearchResultsEventArgs}.</p>
             * @property onRenderSearchResult - <p>Event which fires when a search result link is rendered. The event arguments are of type {@link componyx.UI.AppSkin.SearchResultEventArgs}.</p>
             * @property onPostSearchResults - <p>Event which fires after the search results are rendered. The event arguments are of type {@link componyx.UI.AppSkin.SearchResultsEventArgs}.</p>
             * @property onResize - <p>Event which fires when the window is resized. The event arguments are of type {@link componyx.UI.AppSkin.ResizeActionEventArgs}.</p>
             */
            class AppSkinEvents extends componyx.UI.base.Events<componyx.UI.AppSkin>
            {
                constructor();
                /**
                 * <p>Event which fires when the login-screen is shown.</p>
                */
                onShowLogin: componyx.UI.base.Event<componyx.UI.AppSkin, undefined>;
                /**
                 * <p>Event which fires when the login-verification-screen is shown.</p>
                */
                onShowLoginVerification: componyx.UI.base.Event<componyx.UI.AppSkin, undefined>;
                /**
                 * <p>Event which fires when the page-screen is shown.</p>
                */
                onShowPage: componyx.UI.base.Event<componyx.UI.AppSkin, undefined>;
                /**
                 * <p>Event which fires when the error-screen is shown.</p>
                */
                onShowError: componyx.UI.base.Event<componyx.UI.AppSkin, undefined>;
                /**
                 * <p>Event which fires when the menu is shown.</p>
                */
                onShowMenu: componyx.UI.base.Event<componyx.UI.AppSkin, undefined>;
                /**
                 * <p>Event which fires when the menu is hidden.</p>
                */
                onHideMenu: componyx.UI.base.Event<componyx.UI.AppSkin, undefined>;
                /**
                 * <p>Event which fires when a login attempt is made. The event arguments are of type {@link componyx.UI.AppSkin.AuthenticationResponseEventArgs}.</p>
                */
                onLoginAttempt: componyx.UI.base.Event<componyx.UI.AppSkin, componyx.UI.AppSkin.AuthenticationResponseEventArgs>;
                /**
                 * <p>Event which fires when a login verification attempt is made. The event arguments are of type {@link componyx.UI.AppSkin.AuthenticationResponseEventArgs}.</p>
                */
                onLoginVerificationAttempt: componyx.UI.base.Event<componyx.UI.AppSkin, componyx.UI.AppSkin.AuthenticationResponseEventArgs>;
                /**
                 * <p>Event which fires when the user logged out. The event arguments are of type {@link componyx.UI.AppSkin.AuthenticationResponseEventArgs}.</p>
                */
                onLogout: componyx.UI.base.Event<componyx.UI.AppSkin, componyx.UI.AppSkin.AuthenticationResponseEventArgs>;
                /**
                 * <p>Event which fires before the search results are rendered. The event arguments are of type {@link componyx.UI.AppSkin.SearchResultsEventArgs}.</p>
                */
                onPreSearchResults: componyx.UI.base.Event<componyx.UI.AppSkin, componyx.UI.AppSkin.SearchResultsEventArgs>;
                /**
                 * <p>Event which fires when a search result link is rendered. The event arguments are of type {@link componyx.UI.AppSkin.SearchResultEventArgs}.</p>
                */
                onRenderSearchResult: componyx.UI.base.Event<componyx.UI.AppSkin, componyx.UI.AppSkin.SearchResultEventArgs>;
                /**
                 * <p>Event which fires after the search results are rendered. The event arguments are of type {@link componyx.UI.AppSkin.SearchResultsEventArgs}.</p>
                */
                onPostSearchResults: componyx.UI.base.Event<componyx.UI.AppSkin, componyx.UI.AppSkin.SearchResultsEventArgs>;
                /**
                 * <p>Event which fires when the window is resized. The event arguments are of type {@link componyx.UI.AppSkin.ResizeActionEventArgs}.</p>
                */
                onResize: componyx.UI.base.Event<componyx.UI.AppSkin, componyx.UI.AppSkin.ResizeActionEventArgs>;
            }
            /**
             * <p>ScreenOption</p>
             */
            enum ScreenOption
            {
                /**
                 * <p>the login screen is visible</p>
                 */
                LOGIN = 0,
                /**
                 * <p>the login verification screen is visible</p>
                 */
                LOGIN_VERIFICATION = 1,
                /**
                 * <p>the portal navigation screen is visible</p>
                 */
                PORTAL = 2,
                /**
                 * <p>the page is visible</p>
                 */
                PAGE = 3
            }
            /**
             * <p>MenuTypeOption</p>
             */
            enum MenuTypeOption
            {
                /**
                 * <p>the main menu is displayed as portal navigation</p>
                 */
                PORTALMENU = 0,
                /**
                 * <p>the main menu is displayed as side navigation</p>
                 */
                SIDEMENU = 1
            }
            /**
             * <p>MenuSectionOption</p>
             */
            enum MenuSectionOption
            {
                /**
                 * <p>the menu-item will be rendered in the header and main menu-sections</p>
                 */
                HEADER = 0,
                /**
                 * <p>the menu-item will be rendered in the main menu-section</p>
                 */
                MAIN = 1,
                /**
                 * <p>the menu-item will be rendered in the footer menu-section</p>
                 */
                FOOTER = 2,
                /**
                 * <p>the menu-item will be rendered in the quick-launch menu-section</p>
                 */
                QUICKLAUNCH = 3
            }
            /**
             * <p>ButtonTileSizeOption</p>
             */
            enum TileSizeOption
            {
                /**
                 * <p>renders the menu-item button as small tile in the portal-menu</p>
                 */
                SMALL = 1,
                /**
                 * <p>renders the menu-item button as small-wide tile in the portal-menu</p>
                 */
                SMALL_WIDE = 2,
                /**
                 * <p>renders the menu-item button as medium tile in the portal-menu</p>
                 */
                MEDIUM = 4,
                /**
                 * <p>renders the menu-item button as medium-wide tile in the portal-menu</p>
                 */
                MEDIUM_WIDE = 8,
                /**
                 * <p>renders the menu-item button as large tile in the portal-menu</p>
                 */
                LARGE = 16
            }
            namespace TileSizeOption
            {
                /**
                 * <p>Gets the lowercase name of the option value.</p>
                 * @param value - <p>The enum value.</p>
                 */
                function getName(value: componyx.UI.AppSkin.TileSizeOption): string;
            }
            /**
             * <p>RoutePathMatchingOption</p>
             */
            enum RoutePathMatchingOption
            {
                /**
                 * <p>there is no menu-item route-path matching</p>
                 */
                DISABLED = 0,
                /**
                 * <p>matches if the item's route-path equals the current URL route-path exactly</p>
                 */
                EXACT = 1,
                /**
                 * <p>matches if the item's route-path equals the current URL route-path while ignoring possible parameters preceded by a question mark character.</p>
                 */
                PARTIAL = 2
            }
            /**
             * <p>FooterDisplayOption</p>
             */
            enum FooterDisplayOption
            {
                /**
                 * <p>the footer is not visible</p>
                 */
                DISABLED = 0,
                /**
                 * <p>the footer is visible when the menu is visible</p>
                 */
                MENU = 1,
                /**
                 * <p>the footer is always visible</p>
                 */
                PERSISTENT = 2
            }
            /**
             * <p>FailureReasonOption</p>
             */
            enum FailureReasonOption
            {
                /**
                 * <p>Provided CRSF Token does not match with token in Session object.</p>
                 */
                CRSF_TOKEN_MISMATCH = 0,
                /**
                 * <p>Total attempts exceeded configured max sign-in attempts.</p>
                 */
                MAX_SIGNIN_ATTEMPTS_EXCEEDED = 1,
                /**
                 * <p>Provided username and/or password do not match.</p>
                 */
                USERNAME_OR_PASSWORD_MISMATCH = 2,
                /**
                 * <p>Provided verificatin code does not match.</p>
                 */
                VERIFICATION_CODE_MISMATCH = 3,
                /**
                 * <p>The generated verification-code has expired.</p>
                 */
                VERIFICATION_CODE_EXPIRED = 4,
                /**
                 * <p>Total attempts exceeded the configured max verify code attempts.</p>
                 */
                MAX_VERIFY_ATTEMPTS_EXCEEDED = 5,
                /**
                 * <p>Other reason</p>
                 */
                OTHER = 6
            }
            namespace FailureReasonOption
            {
                /**
                 * <p>Gets the lowercase name of the option value.</p>
                 * @param value - <p>The enum value.</p>
                 */
                function getName(value: componyx.UI.AppSkin.FailureReasonOption): string;
            }
            /**
             * <p>AuthenticationStateOption</p>
             */
            enum AuthenticationStateOption
            {
                /**
                 * <p>The user is not authenticated.</p>
                 */
                UNAUTHENTICATED = 0,
                /**
                 * <p>The credentials have been successfully validated but the user is not yet authenticated (Step 1 in Two-Factor authentication).</p>
                 */
                CREDENTIALS_VALIDATED = 1,
                /**
                 * <p>The user is successfully authenticated.</p>
                 */
                AUTHENTICATED = 2
            }
            /**
             * <p>Creates an instance of the AppSkin MenuItem.</p>
             * @property menuSection - <p>Gets or sets a value indicating in which menu-section the item is displayed.</p>
             * @property groupTileSize - <p>Gets or sets the tile-size of the portal menu group.</p>
             * @property buttonTileSize - <p>Gets or sets the tile-size of the portal menu buttons.</p>
             * @property categoryInHeader - <p>Gets or sets a value indicating if the category (isCategory:true) is shown in the header-menu when menuSection:HEADER. By default the category is always displayed in the main-menu.</p>
             * @param properties - <p>The properties used to initialize the object.</p>
             */
            class MenuItem extends componyx.UI.Menu.Item
            {
                constructor(properties: any);
                /**
                 * <p>Gets or sets a value indicating in which menu-section the item is displayed.</p>
                */
                menuSection: componyx.UI.AppSkin.MenuSectionOption;
                /**
                 * <p>Gets or sets the tile-size of the portal menu group.</p>
                */
                groupTileSize: componyx.UI.AppSkin.TileSizeOption;
                /**
                 * <p>Gets or sets the tile-size of the portal menu buttons.</p>
                */
                buttonTileSize: componyx.UI.AppSkin.TileSizeOption;
                /**
                 * <p>Gets or sets a value indicating if the category (isCategory:true) is shown in the header-menu when menuSection:HEADER. By default the category is always displayed in the main-menu.</p>
                */
                categoryInHeader: boolean;
            }
        }
    }
}