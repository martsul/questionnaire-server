import { ClientImg } from "./client-img";
import { StaticThemes } from "./static-themes";

export type UpdateFormData = {
    formId: number;
    title: string;
    description: string;
    img: ClientImg;
    theme: StaticThemes;
    ownTheme?: string;
    isPublic: boolean;
};
