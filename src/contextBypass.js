export const BYPASS_CONTEXT_WRAPPER = true;

const getValue = (item, keys) => {
  for (const key of keys) {
    if (item?.[key] !== undefined && item?.[key] !== null) {
      return item[key];
    }
  }

  return null;
};

const normalizeRoute = (route) => {
  if (typeof route !== "string") {
    return "";
  }

  const trimmedRoute = route.trim();

  if (!trimmedRoute || trimmedRoute === "#" || trimmedRoute === "/context") {
    return "";
  }

  return trimmedRoute.startsWith("/")
    ? trimmedRoute
    : `/${trimmedRoute}`;
};

const getDisplayOrder = (item) =>
  getValue(item, [
    "displayOrder",
    "DisplayOrder",
    "sortOrder",
    "SortOrder",
  ]) ?? 9999;

const getMenuId = (item) =>
  getValue(item, [
    "id",
    "Id",
    "menuId",
    "MenuId",
  ]);

const getParentMenuId = (item) =>
  getValue(item, [
    "parent_MenuID",
    "parentMenuId",
    "ParentMenuId",
    "Parent_MenuID",
  ]);

const findFirstRoute = (items) => {
  for (const item of items) {
    const route = normalizeRoute(
      getValue(item, ["route", "Route"])
    );

    if (route) {
      return route;
    }

    const childRoute = findFirstRoute(item.children ?? []);

    if (childRoute) {
      return childRoute;
    }
  }

  return "";
};

export const getFirstMenuRoute = (menu) => {
  if (!Array.isArray(menu) || menu.length === 0) {
    return "/access-denied";
  }

  const normalizedMenu = menu
    .filter((item) => item && typeof item === "object")
    .map((item, index) => ({
      ...item,
      _menuId: getMenuId(item),
      _parentMenuId: getParentMenuId(item),
      _order: getDisplayOrder(item),
      _index: index,
      children: [],
    }));

  const byId = new Map();
  const roots = [];

  normalizedMenu.forEach((item) => {
    if (item._menuId !== null && item._menuId !== undefined) {
      byId.set(item._menuId, item);
    }
  });

  normalizedMenu.forEach((item) => {
    if (
      item._parentMenuId !== null &&
      item._parentMenuId !== undefined &&
      byId.has(item._parentMenuId)
    ) {
      byId.get(item._parentMenuId).children.push(item);
    } else {
      roots.push(item);
    }
  });

  const sortMenu = (items) => {
    items.sort((a, b) => a._order - b._order || a._index - b._index);
    items.forEach((item) => sortMenu(item.children));
  };

  sortMenu(roots);

  return (
    findFirstRoute(roots) ||
    findFirstRoute(normalizedMenu) ||
    "/access-denied"
  );
};
