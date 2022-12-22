"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guid = void 0;
const performance_now_1 = require("performance-now");
class Guid {
}
exports.Guid = Guid;
Guid.newGuid = (noHyphens) => {
    let d = new Date().getTime();
    if (typeof performance_now_1.default === 'function') {
        d += (0, performance_now_1.default)();
    }
    const shellGuid = noHyphens ? 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx' : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return shellGuid.replace(/[xy]/g, function (c) {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : r & (0x3 | 0x8)).toString(16);
    });
};
Guid.empty = '00000000-0000-0000-0000-000000000000';
//# sourceMappingURL=Guid.js.map