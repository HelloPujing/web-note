"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var classnames_1 = require("classnames");
require("./button.less");
var noop = function () { };
var Temp = react_1.default.forwardRef(function (_a, ref) {
    var _b;
    var _c = _a.theme, theme = _c === void 0 ? 'default' : _c, _d = _a.size, size = _d === void 0 ? 'H40' : _d, _e = _a.shape, shape = _e === void 0 ? 'square' : _e, _f = _a.bolder, bolder = _f === void 0 ? false : _f, _g = _a.ghost, ghost = _g === void 0 ? false : _g, _h = _a.block, block = _h === void 0 ? false : _h, _j = _a.className, className = _j === void 0 ? '' : _j, children = _a.children, _k = _a.onClick, onClick = _k === void 0 ? noop : _k, otherProps = __rest(_a, ["theme", "size", "shape", "bolder", "ghost", "block", "className", "children", "onClick"]);
    var handleOnClick = react_1.useCallback(function () {
        if (onClick) {
            onClick();
        }
    }, [onClick]);
    return (<button type="button" ref={ref} className={classnames_1.default('mj-btn', (_b = {},
        _b["btn-" + theme] = theme !== 'default',
        _b["btn-" + size] = size,
        _b["btn-" + shape] = shape,
        _b['btn-bold'] = bolder,
        _b['btn-ghost'] = ghost,
        _b['btn-block'] = block,
        _b), className)} onClick={handleOnClick} {...otherProps}>
        {children}
      </button>);
});
exports.default = Temp;
