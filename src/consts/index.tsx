// import WebTwoToneIcon from "@mui/icons-material/WebTwoTone";
// import LanguageTwoToneIcon from "@mui/icons-material/LanguageTwoTone";
import TitleTwoToneIcon from "@mui/icons-material/TitleTwoTone";
import ColorizeTwoToneIcon from "@mui/icons-material/ColorizeTwoTone";
// import SegmentTwoToneIcon from "@mui/icons-material/SegmentTwoTone";
// import TagIcon from "@mui/icons-material/Tag";
// import LineWeightTwoToneIcon from "@mui/icons-material/LineWeightTwoTone";
import GridOnTwoToneIcon from "@mui/icons-material/GridOnTwoTone";
import AccountCircleTwoToneIcon from "@mui/icons-material/AccountCircleTwoTone";
import AltRouteTwoToneIcon from "@mui/icons-material/AltRouteTwoTone";
import BrushTwoToneIcon from "@mui/icons-material/BrushTwoTone";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import LinkTwoToneIcon from "@mui/icons-material/LinkTwoTone";
import ImageTwoToneIcon from "@mui/icons-material/ImageTwoTone";
import AppsTwoToneIcon from "@mui/icons-material/AppsTwoTone";
import SettingsTwoToneIcon from "@mui/icons-material/SettingsTwoTone";
import CodeTwoToneIcon from "@mui/icons-material/CodeTwoTone";
import PhoneIphoneTwoToneIcon from "@mui/icons-material/PhoneIphoneTwoTone";
import ArticleTwoToneIcon from "@mui/icons-material/ArticleTwoTone";

import waveDemo from "../../public/images/preview-theme/cd-demo.npub.pro.png";
import rubyDemo from "../../public/images/preview-theme/croxroadnews-demo.npub.pro.png";
import tasteDemo from "../../public/images/preview-theme/enki-demo.npub.pro.png";
import episodeDemo from "../../public/images/preview-theme/episode-demo.npub.pro.png";
import fizzyDemo from "../../public/images/preview-theme/essential-demo.npub.pro.png";
import journalDemo from "../../public/images/preview-theme/fiatjaf-demo.npub.pro.png";
import dawnDemo from "../../public/images/preview-theme/hodlbod-demo.npub.pro.png";
import edgeDemo from "../../public/images/preview-theme/inkblotart-demo.npub.pro.png";
import massivelyDemo from "../../public/images/preview-theme/isolabell-demo.npub.pro.png";
import altoDemo from "../../public/images/preview-theme/jackmallers-demo.npub.pro.png";
import soloDemo from "../../public/images/preview-theme/karnage-demo.npub.pro.png";
import dopeDemo from "../../public/images/preview-theme/lectio-demo.npub.pro.png";
import attilaDemo from "../../public/images/preview-theme/lynalden-demo.npub.pro.png";
import londonDemo from "../../public/images/preview-theme/malos10-demo.npub.pro.png";
import simplyDemo from "../../public/images/preview-theme/nogood-demo.npub.pro.png";
import pawayDemo from "../../public/images/preview-theme/onyx-demo.npub.pro.png";
import bulletinDemo from "../../public/images/preview-theme/rabble-demo.npub.pro.png";
import editionDemo from "../../public/images/preview-theme/alanbwt-demo.npub.pro.png";
import digestDemo from "../../public/images/preview-theme/tony-demo.npub.pro.png";
import microSimplyDemo from "../../public/images/preview-theme/corndalorian-npub-pro.npub.pro.png";
import microRubyDemo from "../../public/images/preview-theme/m-t-npub-pro.npub.pro.png";
import lieblingDemo from "../../public/images/preview-theme/laeserin-npub-pro.npub.pro.png";

// import AccessTimeTwoToneIcon from "@mui/icons-material/AccessTimeTwoTone";
// import LockTwoToneIcon from "@mui/icons-material/LockTwoTone";
// import ThumbUpTwoToneIcon from "@mui/icons-material/ThumbUpTwoTone";
// import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
// import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";
// import TranslateTwoToneIcon from "@mui/icons-material/TranslateTwoTone";
// import HomeTwoToneIcon from "@mui/icons-material/HomeTwoTone";

export const NPUB_PRO_DOMAIN = "npub.pro";
export const NPUB_PRO_API = "https://api.npubpro.com";

export const kindsMap: { [key: number]: string } = {
  1: "Notes",
  30023: "Long-form posts",
};

export const SIDEBAR_WIDTH = 280;
export const NAV_CONFIG = [
  {
    title: "Dashboard",
    path: "dashboard",
    icon: <GridOnTwoToneIcon />,
  },
  // {
  //   title: "View site",
  //   path: "view-site",
  //   icon: <WebTwoToneIcon />,
  // },
  {
    title: "Theme settings",
    path: "switchTheme",
    icon: <BrushTwoToneIcon />,
  },
  {
    title: "Settings",
    path: "settings",
    icon: <SettingsTwoToneIcon />,
  },
];

export const HASH_CONFIG = {
  TITLE_DESCRIPTION: "title-description",
  TIMEZONE: "timezone",
  LANGUAGE: "language",
  META_DATA: "meta-data",
  X_CARD: "x-card",
  FACEBOOK_CARD: "facebook-card",
  SOCIAL_ACCOUNTS: "social-accounts",
  PRIVATE: "private",
  CONTRIBUTORS: "contributors",
  DESIGN_BRANDING: "design-branding",
  NAVIGATION: "navigation",
  RECOMMENDATION: "recommendation",
  URL: "url",
  ICON: "icon",
  IMAGE: "image",
  HASHTAGS: "hashtags",
  KINDS: "kinds",
  ACCENT_COLOR: "accent-color",
  PLUGINS: "plugins",
  APP_NAME: "app-name",
  CONTENT: "content",
  CONTENT_HOMEPAGE: "content-homepage",
};

export const SETTINGS_CONFIG = [
  {
    title: "General settings",
    sublist: [
      {
        title: "Website address",
        path: HASH_CONFIG.URL,
        icon: <LinkTwoToneIcon />,
      },
      {
        title: "Title & Description",
        path: HASH_CONFIG.TITLE_DESCRIPTION,
        icon: <TitleTwoToneIcon />,
      },
      // {
      //   title: "Timezone",
      //   path: HASH_CONFIG.TIMEZONE,
      //   icon: <AccessTimeTwoToneIcon />,
      // },
      // {
      //   title: "Publication language",
      //   path: HASH_CONFIG.LANGUAGE,
      //   icon: <TranslateTwoToneIcon />,
      // },
      // {
      //   title: "Meta data",
      //   path: HASH_CONFIG.META_DATA,
      //   icon: <LineWeightTwoToneIcon />,
      // },
      // {
      //   title: "X card",
      //   path: HASH_CONFIG.X_CARD,
      //   icon: <CloseTwoToneIcon />,
      // },
      // {
      //   title: "Facebook card",
      //   path: HASH_CONFIG.FACEBOOK_CARD,
      //   icon: <FacebookTwoToneIcon />,
      // },
      // {
      //   title: "Social accounts",
      //   path: HASH_CONFIG.SOCIAL_ACCOUNTS,
      //   icon: <ThumbUpTwoToneIcon />,
      // },
      {
        title: "Contributors",
        path: HASH_CONFIG.CONTRIBUTORS,
        icon: <AccountCircleTwoToneIcon />,
      },
      // {
      //   title: "Content",
      //   path: HASH_CONFIG.CONTENT,
      //   icon: <ArticleTwoToneIcon />,
      // },
      {
        title: "Plugins",
        path: HASH_CONFIG.PLUGINS,
        icon: <CodeTwoToneIcon />,
      },
    ],
  },
  {
    title: "Design",
    sublist: [
      {
        title: "Theme",
        path: HASH_CONFIG.DESIGN_BRANDING,
        icon: <BrushTwoToneIcon />,
      },
      {
        title: "App name",
        path: HASH_CONFIG.APP_NAME,
        icon: <PhoneIphoneTwoToneIcon />,
      },
      {
        title: "Accent color",
        path: HASH_CONFIG.ACCENT_COLOR,
        icon: <ColorizeTwoToneIcon />,
      },
      {
        title: "Icon",
        path: HASH_CONFIG.ICON,
        icon: <AppsTwoToneIcon />,
      },
      {
        title: "Image",
        path: HASH_CONFIG.IMAGE,
        icon: <ImageTwoToneIcon />,
      },
      {
        title: "Navigation",
        path: HASH_CONFIG.NAVIGATION,
        icon: <AltRouteTwoToneIcon />,
      },
    ],
  },
  {
    title: "Homepage",
    sublist: [
      {
        title: "Homepage content",
        path: HASH_CONFIG.CONTENT_HOMEPAGE,
        icon: <ArticleTwoToneIcon />,
      },
    ],
  },
  {
    title: "Growth",
    sublist: [
      {
        title: "Recommendations",
        path: HASH_CONFIG.RECOMMENDATION,
        icon: <FavoriteTwoToneIcon />,
      },
    ],
  },
];

export const TIMEZONE_LIST = [
  {
    name: "Pacific/Pago_Pago",
    label: "(GMT -11:00) Midway Island, Samoa",
  },
  {
    name: "Pacific/Honolulu",
    label: "(GMT -10:00) Hawaii",
  },
  {
    name: "America/Anchorage",
    label: "(GMT -9:00) Alaska",
  },
  {
    name: "America/Tijuana",
    label: "(GMT -8:00) Chihuahua, La Paz, Mazatlan",
  },
  {
    name: "America/Los_Angeles",
    label: "(GMT -8:00) Pacific Time (US & Canada); Tijuana",
  },
  {
    name: "America/Phoenix",
    label: "(GMT -7:00) Arizona",
  },
  {
    name: "America/Denver",
    label: "(GMT -7:00) Mountain Time (US & Canada)",
  },
  {
    name: "America/Costa_Rica",
    label: "(GMT -6:00) Central America",
  },
  {
    name: "America/Chicago",
    label: "(GMT -6:00) Central Time (US & Canada)",
  },
  {
    name: "America/Mexico_City",
    label: "(GMT -6:00) Guadalajara, Mexico City, Monterrey",
  },
  {
    name: "America/Regina",
    label: "(GMT -6:00) Saskatchewan",
  },
  {
    name: "America/Bogota",
    label: "(GMT -5:00) Bogota, Lima, Quito",
  },
  {
    name: "America/New_York",
    label: "(GMT -5:00) Eastern Time (US & Canada)",
  },
  {
    name: "America/Fort_Wayne",
    label: "(GMT -5:00) Indiana (East)",
  },
  {
    name: "America/Caracas",
    label: "(GMT -4:00) Caracas, La Paz",
  },
  {
    name: "America/Halifax",
    label: "(GMT -4:00) Atlantic Time (Canada); Greenland",
  },
  {
    name: "America/Santiago",
    label: "(GMT -4:00) Santiago",
  },
  {
    name: "America/St_Johns",
    label: "(GMT -3:30) Newfoundland",
  },
  {
    name: "America/Argentina/Buenos_Aires",
    label: "(GMT -3:00) Buenos Aires, Brasilia, Georgetown",
  },
  {
    name: "America/Noronha",
    label: "(GMT -2:00) Fernando de Noronha",
  },
  {
    name: "Atlantic/Azores",
    label: "(GMT -1:00) Azores",
  },
  {
    name: "Atlantic/Cape_Verde",
    label: "(GMT -1:00) Cape Verde Is.",
  },
  {
    name: "Etc/UTC",
    label: "(GMT) UTC",
  },
  {
    name: "Africa/Casablanca",
    label: "(GMT +0:00) Casablanca, Monrovia",
  },
  {
    name: "Europe/Dublin",
    label: "(GMT +0:00) Dublin, Edinburgh, London",
  },
  {
    name: "Europe/Amsterdam",
    label: "(GMT +1:00) Amsterdam, Berlin, Rome, Stockholm, Vienna",
  },
  {
    name: "Europe/Prague",
    label: "(GMT +1:00) Belgrade, Bratislava, Budapest, Prague",
  },
  {
    name: "Europe/Paris",
    label: "(GMT +1:00) Brussels, Copenhagen, Madrid, Paris",
  },
  {
    name: "Europe/Warsaw",
    label: "(GMT +1:00) Sarajevo, Skopje, Warsaw, Zagreb",
  },
  {
    name: "Africa/Lagos",
    label: "(GMT +1:00) West Central Africa",
  },
  {
    name: "Europe/Istanbul",
    label: "(GMT +2:00) Athens, Beirut, Bucharest, Istanbul",
  },
  {
    name: "Africa/Cairo",
    label: "(GMT +2:00) Cairo, Egypt",
  },
  {
    name: "Africa/Maputo",
    label: "(GMT +2:00) Harare",
  },
  {
    name: "Europe/Kiev",
    label: "(GMT +2:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius",
  },
  {
    name: "Asia/Jerusalem",
    label: "(GMT +2:00) Jerusalem",
  },
  {
    name: "Africa/Johannesburg",
    label: "(GMT +2:00) Pretoria",
  },
  {
    name: "Asia/Baghdad",
    label: "(GMT +3:00) Baghdad",
  },
  {
    name: "Asia/Riyadh",
    label: "(GMT +3:00) Kuwait, Nairobi, Riyadh",
  },
  {
    name: "Europe/Moscow",
    label: "(GMT +3:00) Moscow, St. Petersburg, Volgograd",
  },
  {
    name: "Asia/Tehran",
    label: "(GMT +3:30) Tehran",
  },
  {
    name: "Asia/Dubai",
    label: "(GMT +4:00) Abu Dhabi, Muscat",
  },
  {
    name: "Asia/Baku",
    label: "(GMT +4:00) Baku, Tbilisi, Yerevan",
  },
  {
    name: "Asia/Kabul",
    label: "(GMT +4:30) Kabul",
  },
  {
    name: "Asia/Karachi",
    label: "(GMT +5:00) Islamabad, Karachi, Tashkent",
  },
  {
    name: "Asia/Yekaterinburg",
    label: "(GMT +5:00) Yekaterinburg",
  },
  {
    name: "Asia/Kolkata",
    label: "(GMT +5:30) Chennai, Calcutta, Mumbai, New Delhi",
  },
  {
    name: "Asia/Kathmandu",
    label: "(GMT +5:45) Katmandu",
  },
  {
    name: "Asia/Almaty",
    label: "(GMT +6:00) Almaty, Novosibirsk",
  },
  {
    name: "Asia/Dhaka",
    label: "(GMT +6:00) Astana, Dhaka, Sri Jayawardenepura",
  },
  {
    name: "Asia/Rangoon",
    label: "(GMT +6:30) Rangoon",
  },
  {
    name: "Asia/Bangkok",
    label: "(GMT +7:00) Bangkok, Hanoi, Jakarta",
  },
  {
    name: "Asia/Krasnoyarsk",
    label: "(GMT +7:00) Krasnoyarsk",
  },
  {
    name: "Asia/Hong_Kong",
    label: "(GMT +8:00) Beijing, Chongqing, Hong Kong, Urumqi",
  },
  {
    name: "Asia/Irkutsk",
    label: "(GMT +8:00) Irkutsk, Ulaan Bataar",
  },
  {
    name: "Asia/Singapore",
    label: "(GMT +8:00) Kuala Lumpur, Perth, Singapore, Taipei",
  },
  {
    name: "Asia/Tokyo",
    label: "(GMT +9:00) Osaka, Sapporo, Tokyo",
  },
  {
    name: "Asia/Seoul",
    label: "(GMT +9:00) Seoul",
  },
  {
    name: "Asia/Yakutsk",
    label: "(GMT +9:00) Yakutsk",
  },
  {
    name: "Australia/Adelaide",
    label: "(GMT +9:30) Adelaide",
  },
  {
    name: "Australia/Darwin",
    label: "(GMT +9:30) Darwin",
  },
  {
    name: "Australia/Brisbane",
    label: "(GMT +10:00) Brisbane, Guam, Port Moresby",
  },
  {
    name: "Australia/Sydney",
    label: "(GMT +10:00) Canberra, Hobart, Melbourne, Sydney, Vladivostok",
  },
  {
    name: "Asia/Magadan",
    label: "(GMT +11:00) Magadan, Soloman Is., New Caledonia",
  },
  {
    name: "Pacific/Auckland",
    label: "(GMT +12:00) Auckland, Wellington",
  },
  {
    name: "Pacific/Fiji",
    label: "(GMT +12:00) Fiji, Kamchatka, Marshall Is.",
  },
  {
    name: "Pacific/Kwajalein",
    label: "(GMT +12:00) International Date Line West",
  },
];

export enum TYPES_THEMES_TAG {
  MICROBLOG = "microblog",
  BLOG = "blog",
  PODCAST = "podcast",
  PHOTOGRAPHY = "photography",
  RECIPES = "recipes",
  MAGAZINE = "magazine",
}

export const THEMES_PREVIEW = [
  {
    id: "naddr1qqrxcmmwv3hkuq3qpr4du5xl28dy5sh4msz9uddnwxgzupkk4qzjzklv84edc6ruevzqxpqqqpmnye00ces",
    tag: "photography",
    name: "London",
    url: "https://malos10-demo.npub.pro",
    preview: londonDemo,
  },
  {
    id: "naddr1qqzxgcthdcpzqz82megd75w6ffp0thqytc6mxuvs9crdd2q9y9d7c0tjm358ejcyqvzqqqrhxgsugqzh",
    tag: "blog",
    name: "Dawn",
    url: "https://hodlbod-demo.npub.pro",
    preview: dawnDemo,
  },
  {
    id: "naddr1qqzhgctnw3jsygqgat09ph63mf9y9awuq30rtvm3jqhqd44gq5s4hmpawtwxslxtqspsgqqqwueqj9k6nd",
    tag: "recipes",
    name: "Taste",
    url: "https://enki-demo.npub.pro",
    preview: tasteDemo,
  },
  {
    id: "naddr1qq9x66trwfhj6un4vfusygqgat09ph63mf9y9awuq30rtvm3jqhqd44gq5s4hmpawtwxslxtqspsgqqqwueq49c2sl",
    tag: "microblog",
    name: "Micro-ruby",
    url: "https://m-t-npub-pro.npub.pro/",
    preview: microRubyDemo,
  },
  {
    id: "naddr1qqz8wctkv5pzqz82megd75w6ffp0thqytc6mxuvs9crdd2q9y9d7c0tjm358ejcyqvzqqqrhxg06yarz",
    tag: "podcast",
    name: "Wave",
    url: "https://cd-demo.npub.pro",
    preview: waveDemo,
  },
  {
    id: "naddr1qqxx66trwfhj6umfd4cxc7gzyqyw4hjsmaga5jjz7hwqgh34kdceqtsx665q2g2mas7h9hrg0n9sgqcyqqq8wvsequ5f9",
    tag: "microblog",
    name: "Micro-simply",
    url: "https://corndalorian-npub-pro.npub.pro/",
    preview: microSimplyDemo,
  },
  {
    id: "naddr1qqyxc6t9vfkxjmn8qgsq36k72r04rkj2gt6acpz7xkehrypwqmt2spfpt0kr6ukudp7vkpqrqsqqqaej4xaw0c",
    tag: "blog",
    name: "Liebling",
    url: "https://laeserin-npub-pro.npub.pro/",
    preview: lieblingDemo,
  },
  {
    id: "naddr1qqz8yatz0ypzqz82megd75w6ffp0thqytc6mxuvs9crdd2q9y9d7c0tjm358ejcyqvzqqqrhxg05vddj",
    tag: "magazine",
    name: "Ruby",
    url: "https://croxroadnews-demo.npub.pro",
    preview: rubyDemo,
  },
  {
    id: "naddr1qqrk5mm4wfhxzmqzyqyw4hjsmaga5jjz7hwqgh34kdceqtsx665q2g2mas7h9hrg0n9sgqcyqqq8wvsh25luq",
    tag: "blog",
    name: "Journal",
    url: "https://fiatjaf-demo.npub.pro",
    preview: journalDemo,
  },
  {
    id: "naddr1qqzx2er8v5pzqz82megd75w6ffp0thqytc6mxuvs9crdd2q9y9d7c0tjm358ejcyqvzqqqrhxg7zn273",
    tag: "photography",
    name: "Edge",
    url: "https://inkblotart-demo.npub.pro",
    preview: edgeDemo,
  },
  {
    id: "naddr1qqz8xmmvdupzqz82megd75w6ffp0thqytc6mxuvs9crdd2q9y9d7c0tjm358ejcyqvzqqqrhxg3zdu5d",
    tag: "blog",
    name: "Solo",
    url: "https://karnage-demo.npub.pro",
    preview: soloDemo,
  },
  {
    id: "naddr1qqyk6ctnwd5hvetv0ypzqz82megd75w6ffp0thqytc6mxuvs9crdd2q9y9d7c0tjm358ejcyqvzqqqrhxg65mffq",
    tag: "blog",
    name: "Massively",
    url: "https://isolabell-demo.npub.pro",
    preview: massivelyDemo,
  },
  {
    id: "naddr1qqrk2urfwdhkgegzyqyw4hjsmaga5jjz7hwqgh34kdceqtsx665q2g2mas7h9hrg0n9sgqcyqqq8wvs4lzhhz",
    tag: "podcast",
    name: "Episode",
    url: "https://episode-demo.npub.pro",
    preview: episodeDemo,
  },
  {
    id: "naddr1qqrxg6t8v4ehgq3qpr4du5xl28dy5sh4msz9uddnwxgzupkk4qzjzklv84edc6ruevzqxpqqqpmnytfk8l9",
    tag: "blog",
    name: "Digest",
    url: "https://tony-demo.npub.pro",
    preview: digestDemo,
  },
  {
    id: "naddr1qqzhqcthv9usygqgat09ph63mf9y9awuq30rtvm3jqhqd44gq5s4hmpawtwxslxtqspsgqqqwueqavz5au",
    tag: "photography",
    name: "Paway",
    url: "https://onyx-demo.npub.pro",
    preview: pawayDemo,
  },
  {
    id: "naddr1qqzxzmr5dupzqz82megd75w6ffp0thqytc6mxuvs9crdd2q9y9d7c0tjm358ejcyqvzqqqrhxg3rvw8e",
    tag: "blog",
    name: "Alto",
    url: "https://jackmallers-demo.npub.pro",
    preview: altoDemo,
  },
  {
    id: "naddr1qqrk2erfw35k7mszyqyw4hjsmaga5jjz7hwqgh34kdceqtsx665q2g2mas7h9hrg0n9sgqcyqqq8wvspgnlqu",
    tag: "blog",
    name: "Edition",
    url: "https://alanbwt-demo.npub.pro",
    preview: editionDemo,
  },
  {
    id: "naddr1qqyxyatvd3jhg6twqgsq36k72r04rkj2gt6acpz7xkehrypwqmt2spfpt0kr6ukudp7vkpqrqsqqqaejtrgtuy",
    tag: "blog",
    name: "Bulletin",
    url: "https://rabble-demo.npub.pro",
    preview: bulletinDemo,
  },
  {
    id: "naddr1qqr8x6tdwpk8jq3qpr4du5xl28dy5sh4msz9uddnwxgzupkk4qzjzklv84edc6ruevzqxpqqqpmnyykmacn",
    tag: "magazine",
    name: "Simply",
    url: "https://nogood-demo.npub.pro",
    preview: simplyDemo,
  },
  {
    id: "naddr1qqzkv6t60fusygqgat09ph63mf9y9awuq30rtvm3jqhqd44gq5s4hmpawtwxslxtqspsgqqqwueqkvrjjk",
    tag: "recipes",
    name: "Fizzy",
    url: "https://essential-demo.npub.pro",
    preview: fizzyDemo,
  },
  {
    id: "naddr1qqzxgmmsv5pzqz82megd75w6ffp0thqytc6mxuvs9crdd2q9y9d7c0tjm358ejcyqvzqqqrhxgvagq2d",
    tag: "blog",
    name: "Dope",
    url: "https://lectio-demo.npub.pro",
    preview: dopeDemo,
  },
  {
    id: "naddr1qqrxzar5d9kxzq3qpr4du5xl28dy5sh4msz9uddnwxgzupkk4qzjzklv84edc6ruevzqxpqqqpmny6ltg6d",
    tag: "blog",
    name: "Attila",
    url: "https://lynalden-demo.npub.pro",
    preview: attilaDemo,
  },
];
