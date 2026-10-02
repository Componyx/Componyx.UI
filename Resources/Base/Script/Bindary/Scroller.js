/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

await (async function ()
{
    await import(`${$UI.getScriptResourcePath('Base.Bindary.Core')}`);
    const core = componyx.bindary_modules.core;

    const scroller = componyx.bindary_modules.scroller =
    {
        routePath: '',
        timeout: null,
        anchor: null,
        pos: null,
        timerId: null,

        init(anchorScroll, routePath) 
        {
            const pos = core.scrollPos[$bindary.routePath];

            scroller.routePath = routePath;
            core.scrollableRoot = core.scrollableRoot || $lib.scrollableRoot();
            core.scrollableRoot.scrollTop = 0;
            clearTimeout(scroller.timerId);
            scroller.timeout = new Date().getTime() + $bindary.scrollRetryTimeout;

            if (!core.historyAction) 
            {
                if (anchorScroll || $bindary.anchorScroll)
                {
                    scroller.anchor = core.getAnchor();

                    if (scroller.anchor)
                    {
                        scroller.timerId = setTimeout(scroller.scrollToAnchor, 0);
                    }
                }

                return;
            }

            if (!pos || !(pos.y + pos.x)) return;

            scroller.pos = pos;
            scroller.timerId = setTimeout(scroller.scrollToPosition, 0);
        },

        scrollToAnchor() 
        {
            let el;
            const { routePath, timeout, anchor } = scroller;

            if ($bindary.routePath !== routePath) return;

            if ((el = $lib('#' + anchor)) || (el = document.getElementsByName(anchor)[0]))
            {
                if (core.fireEvent('anchorScroll', [el], true) !== false)
                {
                    $lib.scrollTo(el, null, 2);
                }
            } else if (new Date().getTime() <= timeout)
            {
                scroller.timerId = setTimeout(scroller.scrollToAnchor, 0);
            }
        },

        scrollToPosition() 
        {
            const { routePath, timeout, pos } = scroller;

            if ($bindary.routePath !== routePath || !core.historyAction) return;

            const height = core.scrollableRoot.scrollHeight;
            const width = core.scrollableRoot.scrollWidth;

            if (new Date().getTime() > timeout || (width >= pos.width && height >= pos.height))
            {
                window.scrollTo(pos.x, pos.y);
                core.historyAction = false;
            } else
            {
                scroller.timerId = setTimeout(scroller.scrollToPosition, 0);
            }
        }
    };

})();

export default componyx.bindary_modules.scroller;




