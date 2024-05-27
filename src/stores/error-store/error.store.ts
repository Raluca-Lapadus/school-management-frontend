import { create } from 'zustand'

type ErrorStore = {
    bannerInfo: {message: string, severity: string};
    setInfoBanner: (message: string, severity: string) => void;
};
  
export const useErrorStore = create<ErrorStore>((set) => ({
    bannerInfo: {message: '', severity: ''},
    setInfoBanner: (message: string, severity: string) => {
        set({bannerInfo : {message : message, severity: severity}});
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        setTimeout(() => {
            set({bannerInfo : {message : '', severity: ''}});
        }, 4000);
    }
}));
