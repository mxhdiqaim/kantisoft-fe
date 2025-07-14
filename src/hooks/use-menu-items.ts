import type { AppDispatch, RootState } from "@/store";
import { fetchMenuItems } from "@/store/app/menu-items";
import type { MenuItemType } from "@/types/menu-item-type.ts";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// export const useArticle = (id: number) => {
//     const dispatch = useDispatch<AppDispatch>();
//     const { menuItems, loading, submitted } = useSelector((state: RootState) => state.menuItem);
//
//     useEffect(() => {
//         if (id) {
//             dispatch(getArticle(id));
//         }
//     }, [dispatch, id]);
//
//     const updatedArticle = useMemo(() => {
//         if (!article || !article.category) return null;
//
//         const category = transformCategory(article.category);
//
//         return {
//             ...article,
//             category,
//             body: article.category === "sermon" && article.body ? convertFromHtml(article.body) : article.body,
//         } as ArticleType;
//     }, [article]);
//
//     return { updatedArticle, loading, submitted };
// };

export const useMenuItems = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);

    const { menuItems: storeMenuItems, loading } = useSelector(
        (state: RootState) => state.menuItem,
    );

    useEffect(() => {
        dispatch(fetchMenuItems());
    }, [dispatch]);

    useEffect(() => {
        if (storeMenuItems) {
            const updatedMenuItems = storeMenuItems.map((menuItem) => ({
                ...menuItem,
            }));
            setMenuItems([...(updatedMenuItems as MenuItemType[])]);
        }
    }, [storeMenuItems]);

    return { menuItems, loading };
};
