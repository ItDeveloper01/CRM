
import { Link, useLocation } from "react-router-dom";
import ContextSelector from "./RBACSystemScreens/ContextSelector";

import {
  Menu,
  LayoutDashboard,
  UserPlus,
  BarChart3,
  Users,
  Settings,
  Megaphone,
  PieChart,
  ChartColumn,
  ChevronRight,
  Bell,
  BriefcaseBusiness,
  CalendarCheck,
  Target,
  List,
  UsersRound,
  TrendingUp,
  ShieldCheck,
  FileBarChart,
  FileText,
  ChartNoAxesCombined,
  Menu as MenuIcon,
  Circle,
  Plane,
  Palmtree,
  Car,
  Ticket,
  ClipboardList,
  BarChart4
} from "lucide-react";

import {
  useEffect,
  useState
} from "react";

import { useGetSessionUser } from "./SessionContext";
import ReminderPanel from "./ReminderPanel";


/* =========================================================
   ICON MAP
   ========================================================= */

const iconMap = {

  dashboard: LayoutDashboard,

  workspace: BriefcaseBusiness,
  mydashboard: PieChart,
  "my dashboard": PieChart,
  myleads: Users,
  "my leads": Users,
  followups: CalendarCheck,
  "my follow-ups": CalendarCheck,

  leadmanagement: Target,
  "lead management": Target,
  newlead: UserPlus,
  "new lead": UserPlus,
  allleads: List,
  "all leads": List,
  leadanalytics: BarChart3,
  "lead analytics": BarChart3,

  team: UsersRound,
  myteam: ChartColumn,
  "my team": ChartColumn,
  teamdashboard: LayoutDashboard,
  "team dashboard": LayoutDashboard,
  teamperformance: TrendingUp,
  "team performance": TrendingUp,

  communication: Megaphone,
  broadcastmessage: Megaphone,
  "broadcast message": Megaphone,
  notifications: Bell,
  notification: Bell,

  reports: ChartNoAxesCombined,
  salesreports: FileBarChart,
  "sales reports": FileBarChart,
  leadreports: FileText,
  "lead reports": FileText,
  performancereports: ChartColumn,
  "performance reports": ChartColumn,

  administration: Settings,
  users: Users,
  rolespermissions: ShieldCheck,
  "roles & permissions": ShieldCheck,
  menumanagement: MenuIcon,
  "menu management": MenuIcon,
  mastersettings: Settings,
  "master settings": Settings,

  visa: Plane,
  holiday: Palmtree,
  holidays: Palmtree,
  airticketing: Ticket,
  "air ticketing": Ticket,
  carrental: Car,
  "car rental": Car,

  operations: ClipboardList,
  analytics: BarChart4,

  smtpsettings: Settings
};


/* =========================================================
   ICON HELPER
   ========================================================= */

function getMenuIcon(iconName, menuName) {

  const normalizedIcon =
    iconName?.toString().toLowerCase();

  const normalizedName =
    menuName?.toString().toLowerCase();

  if (
    normalizedIcon &&
    iconMap[normalizedIcon]
  ) {
    return iconMap[normalizedIcon];
  }

  if (
    normalizedName &&
    iconMap[normalizedName]
  ) {
    return iconMap[normalizedName];
  }

  return Circle;
}


/* =========================================================
   BUILD MENU TREE
   ========================================================= */

function buildMenuTree(
  items,
  parentId = null
) {

  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .filter(
      item =>
        item.parent_MenuID === parentId
    )
    .sort((a, b) => {

      const orderA =
        a.displayOrder ??
        a.sortOrder ??
        9999;

      const orderB =
        b.displayOrder ??
        b.sortOrder ??
        9999;

      return orderA - orderB;

    })
    .map(item => ({

      ...item,

      children:
        buildMenuTree(
          items,
          item.id
        )

    }));

}


/* =========================================================
   FIND ACTIVE CHILD
   ========================================================= */

function findActiveChild(
  item,
  pathname
) {

  if (
    !item?.children?.length
  ) {
    return null;
  }

  return (
    item.children.find(
      child => {

        if (
          child.route &&
          pathname === child.route
        ) {
          return true;
        }

        /*
          Handles deeper nesting too.
        */

        if (
          child.children?.length
        ) {

          return (
            child.route === pathname ||
            findActiveChild(
              child,
              pathname
            )
          );

        }

        return false;

      }
    ) || null
  );

}


/* =========================================================
   CHECK WHETHER ITEM IS ACTIVE
   ========================================================= */

function isItemActive(
  item,
  pathname
) {

  if (
    item?.route &&
    pathname === item.route
  ) {
    return true;
  }

  if (
    item?.children?.length
  ) {

    return item.children.some(
      child =>
        isItemActive(
          child,
          pathname
        )
    );

  }

  return false;
}


/* =========================================================
   DUMMY REMINDERS
   ========================================================= */

const dummyReminders = [

  {
    id: 1,
    type: "Birthday",
    text: "Rahul Patil",
    urgent: true
  },

  {
    id: 2,
    type: "Birthday",
    text: "Sneha Joshi",
    urgent: false
  },

  {
    id: 3,
    type: "Anniversary",
    text: "Amit Shah",
    urgent: false
  },

  {
    id: 4,
    type: "Visa Expiry",
    text: "John – 15 Dec",
    urgent: true
  },

  {
    id: 5,
    type: "Visa Expiry",
    text: "Maria – 20 Dec",
    urgent: false
  }

];


/* =========================================================
   SIDEBAR
   ========================================================= */

export default function Sidebar() {

  const location =
    useLocation();

  const {
    menu
  } = useGetSessionUser();


  /* =======================================================
     STATE
     ======================================================= */

  const [
    sidebarOpen,
    setSidebarOpen
  ] = useState(true);

  const [
    menuTree,
    setMenuTree
  ] = useState([]);

  const [
    hoveredMenu,
    setHoveredMenu
  ] = useState(null);

  const [
    flyoutPosition,
    setFlyoutPosition
  ] = useState({
    top: 0,
    left: 0
  });


  /* =======================================================
     BUILD TREE
     ======================================================= */

  // useEffect(() => {

  //   alert("menu in sidebar", JSON.stringify(menu));
  //   console.log("menu in sidebar", menu);
  //   if (Array.isArray(menu)) {

  //     setMenuTree(
  //       buildMenuTree(menu)
  //     );

  //   } else {

  //     setMenuTree([]);

  //   }

  // }, [menu]);

useEffect(() => {

  console.log("menu in sidebar", menu);

  if (Array.isArray(menu)) {

    const normalizedMenu = menu.map(item => ({
      ...item,

      id:
        item.id ??
        item.Id,

      // API -> Sidebar expected property
      menuName:
        item.menuName ??
        item.name ??
        item.MenuName ??
        item.Name,

      route:
        item.route ??
        item.Route,

      icon:
        item.icon ??
        item.Icon,

      // API -> Sidebar expected property
      parent_MenuID:
        item.parent_MenuID ??
        item.parentMenuId ??
        item.ParentMenuId ??
        item.Parent_MenuID ??
        null,

      // Keep these available if needed later
      departmentId:
        item.departmentId ??
        item.DepartmentId ??
        null,

      contextTypeId:
        item.contextTypeId ??
        item.ContextTypeId ??
        null
    }));

    console.log(
      "normalized menu",
      normalizedMenu
    );

    setMenuTree(
      buildMenuTree(normalizedMenu)
    );

  } else {

    setMenuTree([]);

  }

}, [menu]);


  /* =======================================================
     HIDE FLYOUT ON ROUTE CHANGE
     ======================================================= */

  useEffect(() => {

    setHoveredMenu(null);

  }, [
    location.pathname
  ]);


  /* =======================================================
     SHOW FLYOUT
     ======================================================= */

  const showFlyout =
    (event, item) => {

      if (
        !item.children?.length
      ) {
        setHoveredMenu(null);
        return;
      }

      const rect =
        event.currentTarget
          .getBoundingClientRect();

      const flyoutWidth = 270;

      /*
        Estimate flyout height.
        It is deliberately conservative.
      */

      const flyoutHeight =
        Math.min(
          450,
          Math.max(
            90,
            item.children.length * 48 + 20
          )
        );

      let top =
        rect.top;

      /*
        Keep it inside viewport.
      */

      if (
        top + flyoutHeight >
        window.innerHeight - 15
      ) {

        top =
          window.innerHeight -
          flyoutHeight -
          15;

      }

      if (top < 15) {
        top = 15;
      }


      let left =
        rect.right + 10;


      /*
        If not enough space on right,
        open towards left.
      */

      if (
        left + flyoutWidth >
        window.innerWidth - 15
      ) {

        left =
          rect.left -
          flyoutWidth -
          10;

      }


      setFlyoutPosition({
        top,
        left
      });

      setHoveredMenu(item);

    };


  /* =======================================================
     HIDE FLYOUT
     ======================================================= */

  const hideFlyout = () => {

    setHoveredMenu(null);

  };


  /* =======================================================
     RENDER ACTIVE CHILD UNDER PARENT
     ======================================================= */

  const renderActiveChild =
    item => {

      if (
        !sidebarOpen ||
        !item.children?.length
      ) {
        return null;
      }


      const activeChild =
        findActiveChild(
          item,
          location.pathname
        );


      if (!activeChild) {
        return null;
      }


      const ChildIcon =
        getMenuIcon(
          activeChild.icon,
          activeChild.menuName
        );


      /*
        If active child itself has children,
        this still displays the active module.
      */

      return (

        <Link
          to={
            activeChild.route ||
            "#"
          }
          onMouseEnter={
            event =>
              showFlyout(
                event,
                item
              )
          }
          className="
            ml-9
            mr-1
            mt-0.5
            mb-1

            flex
            items-center
            gap-2.5

            px-3
            py-1.5

            rounded-lg

            text-xs

            text-blue-700

            bg-blue-50

            border
            border-blue-100

            transition-all

            hover:bg-blue-100
          "
        >

          {/* SMALL ACTIVE INDICATOR */}

          <span
            className="
              w-1.5
              h-1.5

              rounded-full

              bg-blue-600

              shrink-0
            "
          />


          <ChildIcon
            size={14}
            strokeWidth={2}
          />


          <span
            className="
              flex-1

              truncate

              font-semibold
            "
          >
            {activeChild.menuName}
          </span>

        </Link>

      );

    };


  /* =======================================================
     RENDER PRIMARY MENU
     ======================================================= */

  const renderPrimaryItem =
    item => {

      const Icon =
        getMenuIcon(
          item.icon,
          item.menuName
        );

      const hasChildren =
        item.children?.length > 0;

      const active =
        isItemActive(
          item,
          location.pathname
        );

      const hovered =
        hoveredMenu?.id === item.id;


      /* =====================================================
         PARENT
         ===================================================== */

      if (hasChildren) {

        return (

          <div
            key={item.id}
            className="relative"
            onMouseEnter={
              event =>
                showFlyout(
                  event,
                  item
                )
            }
          >

            {/* =================================================
                MAIN PARENT ROW
               ================================================= */}

            <div
              className={`
                relative

                flex
                items-center
                gap-3

                rounded-xl

                px-3
                py-2.5

                cursor-default

                transition-all
                duration-200

                ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }

                ${
                  hovered
                    ? "bg-gray-50"
                    : ""
                }

                ${
                  !sidebarOpen
                    ? "justify-center"
                    : ""
                }
              `}
            >

              {/* ACTIVE BAR */}

              {active && (

                <span
                  className="
                    absolute
                    left-0
                    top-2
                    bottom-2

                    w-1

                    rounded-r-full

                    bg-blue-600
                  "
                />

              )}


              {/* ICON */}

              <Icon
                size={20}
                strokeWidth={
                  active
                    ? 2.4
                    : 1.8
                }
                className="shrink-0"
              />


              {/* NAME */}

              {sidebarOpen && (

                <>

                  <span
                    className={`
                      flex-1

                      text-sm

                      truncate

                      ${
                        active
                          ? "font-semibold"
                          : "font-medium"
                      }
                    `}
                  >
                    {item.menuName}
                  </span>


                  <ChevronRight
                    size={16}
                    className={`
                      transition-all
                      duration-200

                      ${
                        hovered
                          ? "text-blue-600 translate-x-0.5"
                          : "text-gray-400"
                      }
                    `}
                  />

                </>

              )}

            </div>


            {/* =================================================
                ACTIVE CHILD

                Appears DIRECTLY below parent.
               ================================================= */}

            {renderActiveChild(item)}

          </div>

        );

      }


      /* =====================================================
         LEAF MENU
         ===================================================== */

      return (

        <Link
          key={item.id}
          to={
            item.route ||
            "#"
          }
          title={
            !sidebarOpen
              ? item.menuName
              : undefined
          }
          onMouseEnter={
            hideFlyout
          }
          className={`
            relative

            flex
            items-center
            gap-3

            rounded-xl

            px-3
            py-2.5
            mb-1

            transition-all
            duration-200

            ${
              active
                ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }

            ${
              !sidebarOpen
                ? "justify-center"
                : ""
            }
          `}
        >

          {active && (

            <span
              className="
                absolute
                left-0
                top-2
                bottom-2

                w-1

                rounded-r-full

                bg-white
              "
            />

          )}


          <Icon
            size={20}
            strokeWidth={
              active
                ? 2.4
                : 1.8
            }
          />


          {sidebarOpen && (

            <span
              className={`
                text-sm

                truncate

                ${
                  active
                    ? "font-semibold"
                    : "font-medium"
                }
              `}
            >
              {item.menuName}
            </span>

          )}

        </Link>

      );

    };


  /* =========================================================
     FLYOUT
     ========================================================= */

  const renderFlyout =
    () => {

      if (
        !hoveredMenu ||
        !hoveredMenu.children?.length
      ) {
        return null;
      }


      return (

        <div
          className="
            fixed

            z-[99999]

            w-[270px]

            animate-[sidebarFlyout_160ms_ease-out]
          "
          style={{
            top:
              `${flyoutPosition.top}px`,

            left:
              `${flyoutPosition.left}px`
          }}
          onMouseEnter={() => {

            /*
              Keep flyout alive while
              mouse moves from parent
              into flyout.
            */

            setHoveredMenu(
              hoveredMenu
            );

          }}
          onMouseLeave={
            hideFlyout
          }
        >

          {/* =================================================
              SIMPLE FLYOUT
             ================================================= */}

          <div
            className="
              bg-white

              rounded-xl

              border
              border-gray-200

              shadow-[0_18px_45px_rgba(0,0,0,0.15)]

              p-2
            "
          >

            {hoveredMenu.children.map(
              child => {

                const ChildIcon =
                  getMenuIcon(
                    child.icon,
                    child.menuName
                  );

                const active =
                  isItemActive(
                    child,
                    location.pathname
                  );


                return (

                  <Link
                    key={child.id}
                    to={
                      child.route ||
                      "#"
                    }
                    onClick={
                      hideFlyout
                    }
                    className={`
                      group

                      flex
                      items-center
                      gap-3

                      px-3
                      py-2.5

                      rounded-lg

                      mb-1
                      last:mb-0

                      transition-all

                      ${
                        active
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >

                    {/* ICON */}

                    <div
                      className={`
                        w-8
                        h-8

                        rounded-lg

                        flex
                        items-center
                        justify-center

                        shrink-0

                        ${
                          active
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                        }
                      `}
                    >

                      <ChildIcon
                        size={16}
                        strokeWidth={
                          active
                            ? 2.2
                            : 1.7
                        }
                      />

                    </div>


                    {/* NAME */}

                    <span
                      className={`
                        flex-1

                        text-sm

                        ${
                          active
                            ? "font-semibold"
                            : "font-medium"
                        }
                      `}
                    >
                      {child.menuName}
                    </span>


                    {/* ACTIVE DOT */}

                    {active && (

                      <span
                        className="
                          w-2
                          h-2

                          rounded-full

                          bg-blue-600

                          shrink-0
                        "
                      />

                    )}

                  </Link>

                );

              }
            )}

          </div>

        </div>

      );

    };


  /* =========================================================
     RETURN
     ========================================================= */

  return (

    <aside
      className={`
        relative
        z-40

        ${
          sidebarOpen
            ? "w-64"
            : "w-[72px]"
        }

        h-screen

        shrink-0

        bg-white

        border-r
        border-gray-200

        shadow-sm

        flex
        flex-col

        overflow-visible

        transition-all
        duration-300
        ease-in-out
      `}
    >

      {/* =====================================================
          HEADER
         ===================================================== */}

      <div
        className="
          h-[68px]

          shrink-0

          px-3

          border-b
          border-gray-200

          flex
          items-center
        "
      >

        <div
          className={`
            flex
            items-center

            ${
              sidebarOpen
                ? "justify-between w-full"
                : "justify-center w-full"
            }
          `}
        >

          {/* LOGO */}

          <div
            className="
              flex
              items-center
              gap-2.5
            "
          >

            <div
              className="
                w-10
                h-10

                rounded-xl

                bg-gradient-to-br
                from-blue-600
                to-indigo-700

                text-white

                flex
                items-center
                justify-center

                font-bold

                text-base

                shadow-md
                shadow-blue-100

                shrink-0
              "
            >
              G
            </div>


            {sidebarOpen && (

              <div>

                <h2
                  className="
                    text-sm
                    font-bold
                    text-gray-800
                    leading-tight
                  "
                >
                  Girikand
                </h2>

                <p
                  className="
                    text-[9px]

                    text-gray-400

                    uppercase

                    tracking-[0.22em]
                  "
                >
                  CRM
                </p>

              </div>

            )}

          </div>


          {/* COLLAPSE */}

          {sidebarOpen && (

            <button
              type="button"
              onClick={() => {

                setSidebarOpen(false);
                setHoveredMenu(null);

              }}
              title="Collapse sidebar"
              className="
                p-2

                rounded-lg

                text-gray-400

                hover:bg-gray-100
                hover:text-gray-700

                transition
              "
            >

              <Menu
                size={20}
              />

            </button>

          )}


          {/* EXPAND */}

          {!sidebarOpen && (

            <button
              type="button"
              onClick={() => {

                setSidebarOpen(true);

              }}
              title="Expand sidebar"
              className="
                absolute

                top-4
                right-[-14px]

                w-7
                h-7

                rounded-full

                bg-white

                border
                border-gray-200

                shadow-md

                flex
                items-center
                justify-center

                text-gray-500

                hover:text-blue-600
                hover:border-blue-200

                transition

                z-50
              "
            >

              <ChevronRight
                size={15}
              />

            </button>

          )}

        </div>

      </div>

{/* =====================================================
    CONTEXT / WORKSPACE SELECTOR
   ===================================================== */}

{sidebarOpen && (
  <ContextSelector />
)}

      {/* =====================================================
          NAVIGATION
         ===================================================== */}

      <nav
        className="
          flex-1

          min-h-0

          overflow-y-auto
          overflow-x-visible

          px-3
          py-4
        "
      >

        {/* NAVIGATION LABEL */}

        {sidebarOpen &&
          menuTree.length > 0 && (

            <div
              className="
                px-2
                mb-2

                text-[10px]

                uppercase

                tracking-[0.15em]

                font-bold

                text-gray-400
              "
            >
              Navigation
            </div>

          )}


        {/* MENU */}

        {!Array.isArray(menu) ||
        menu.length === 0 ? (

          <div
            className="
              px-2
              py-5
              text-center
            "
          >

            <ShieldCheck
              size={20}
              className="
                mx-auto
                mb-2
                text-gray-400
              "
            />

            {sidebarOpen && (

              <p
                className="
                  text-xs
                  text-gray-500
                  leading-relaxed
                "
              >
                No menu items assigned.
                <br />
                Please contact your administrator.
              </p>

            )}

          </div>

        ) : (

          <div>

            {menuTree.map(
              item =>
                renderPrimaryItem(
                  item
                )
            )}

          </div>

        )}

      </nav>


      {/* =====================================================
          REMINDERS
         ===================================================== */}

      {sidebarOpen &&
      dummyReminders.length > 0 && (

        <div
          className="
            shrink-0

            border-t
            border-gray-200

            bg-white
          "
        >

          <ReminderPanel
            reminders={
              dummyReminders
            }
          />

        </div>

      )}


      {/* =====================================================
          COLLAPSED REMINDER
         ===================================================== */}

      {!sidebarOpen && (

        <div
          className="
            shrink-0

            border-t
            border-gray-200

            p-3
          "
        >

          <button
            type="button"
            title={`${dummyReminders.length} reminders`}
            className="
              relative

              w-full
              h-10

              rounded-xl

              flex
              items-center
              justify-center

              text-gray-500

              hover:bg-gray-50
              hover:text-blue-600

              transition
            "
          >

            <Bell
              size={20}
            />

            {dummyReminders.length > 0 && (

              <span
                className="
                  absolute

                  top-0
                  right-0

                  min-w-[17px]
                  h-[17px]

                  px-1

                  rounded-full

                  bg-red-500

                  text-white

                  text-[9px]

                  font-bold

                  flex
                  items-center
                  justify-center

                  border-2
                  border-white
                "
              >
                {dummyReminders.length}
              </span>

            )}

          </button>

        </div>

      )}


      {/* =====================================================
          GLOBAL FLYOUT

          Outside navigation so it will not be hidden behind
          Current Workspace / reminders / page content.
         ===================================================== */}

      {renderFlyout()}

    </aside>

  );

}

