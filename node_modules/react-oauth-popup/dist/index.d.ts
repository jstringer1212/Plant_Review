import React from 'react';
declare type IWindowProps = {
    url: string;
    title: string;
    width: number;
    height: number;
};
declare type IPopupProps = IWindowProps & {
    onClose: () => void;
    onCode: (code: string, params: URLSearchParams) => void;
    children: React.ReactNode;
};
declare const OauthPopup: React.FC<IPopupProps>;
export default OauthPopup;
//# sourceMappingURL=index.d.ts.map