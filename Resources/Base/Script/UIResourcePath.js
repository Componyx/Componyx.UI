/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";
(function (path, minified)
{
	var r = path + ((minified) ? '{0}.min' : '{0}');
	componyx.UI.setResourcePath(r + '.js', r + '.css', 1, path + '{0}.Themes.Default.css');
})('/src?d=', true);