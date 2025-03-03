import {
  BrushIcon,
  CodeIcon,
  FIleTextIcon,
  HomeIcon,
  ImageIcon,
  IosSmartphoneIcon,
  JsonCodeIcon,
  LinkIcon,
  MessageIcon,
  NavigationIcon,
  PinIcon,
  PipetteIcon,
  StarIcon,
  StarRectangleIcon,
  TitleIcon,
  UserCircleIcon,
  WebIcon,
} from "@/components/Icons";

import {
  KIND_LONG_NOTE,
  KIND_NOTE,
  KIND_OLAS,
  KIND_VIDEO_HORIZONTAL,
  KIND_VIDEO_VERTICAL,
} from "libnostrsite";

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
import headlineDemo from "../../public/images/preview-theme/headline-demo.npub.pro.png";
import easeDemo from "../../public/images/preview-theme/ease-demo.npub.pro.png";
import scriptorDemo from "../../public/images/preview-theme/scriptor-demo.npub.pro.png";
import sourceDemo from "../../public/images/preview-theme/source-demo.npub.pro.png";
import mnmlDemo from "../../public/images/preview-theme/mnml-demo.npub.pro.png";
import vitorsDemo from "../../public/images/preview-theme/vitors-demo.npub.pro.png";
import microLieblingDemo from "../../public/images/preview-theme/micro-liebling-demo.png";
import { SelectTypeSite, TypeAuthor } from "@/types";

export const NPUB_PRO_DOMAIN = "npub.pro";
export const NPUB_PRO_API = "https://api.npubpro.com";

export const OTP_LENGTH = 6;

export const SCREEN = {
  START: "start",
  BUILDING: "building",
  CHOOSE_AUTHOR: "chooseAuthor",
};

export type TypesScreens = (typeof SCREEN)[keyof typeof SCREEN];

export const SUPPORTED_KIND_NAMES: { [key: number]: string } = {
  1: "Notes",
  30023: "Articles",
  20: "Olas photos",
  34235: "Horizontal videos",
  34236: "Vertical videos",
  1063: "Files",
  // 31337: "Music tracks",
};

export const SUPPORTED_KINDS = Object.keys(SUPPORTED_KIND_NAMES).map((k) =>
  Number(k)
);

export const SUPPORTED_KIND_NAMES_SINGLE: { [key: number]: string } = {
  1: "Note",
  30023: "Article",
  20: "Olas photo",
  34235: "Horizontal video",
  34236: "Vertical video",
  1063: "File",
  // 31337: "Music tracks",
};

export const TESTERS = [
  // brugeman
  "3356de61b39647931ce8b2140b2bab837e0810c0ef515bbe92de0248040b8bdd",
  // vitor
  "460c25e682fda7832b52d1f22d3d22b3176d972f60dcdc3212ed8c92ef85065c",
  // amethyst
  "aa9047325603dacd4f8142093567973566de3b1e20a89557b728c3be4c6a844b",
  // archjourney
  "05e4649832dfb8d1bfa81ea7cbf1c92c4f1cd5052bfc8d5465ba744aa6fa5eb8",
  // bitpopart
  "43baaf0c28e6cfb195b17ee083e19eb3a4afdfac54d9b6baf170270ed193e34c",
  // nostrpromo
  "c0ff2ec778904222194d0a05ab96ba385024a57d46720cfc97f58b67dac391a6",
  // traveltelly
  "7d33ba57d8a6e8869a1f1d5215254597594ac0dbfeb01b690def8c461b82db35",
  // k
  "bd4ae3e67e29964d494172261dc45395c89f6bd2e774642e366127171dfb81f5",
  // marco barulli
  "3cfa816bb4892fa6be993ac72a9fcdbb089bdea0c5d9011fd204d154545fa2d9",
  // pitunited
  "f1f9b0996d4ff1bf75e79e4cc8577c89eb633e68415c7faf74cf17a07bf80bd8",
  // Frisian Bears
  "3ba42e70f27a79467bb3377527818384fe41c720ceb3b367223cb896f9954cb2",
  // alex
  "b33f4a427387a151c82a5925b3c9fa631b240563a9c8b82f42af18655845fb2f",
];

export const LIST_SITE_TYPES: SelectTypeSite[] = [
  {
    type: "blog",
    typename: "Blog",
    description: "Optimized for long-form articles",
    kinds: [KIND_LONG_NOTE],
  },
  {
    type: "note",
    typename: "Microblog",
    description: "Optimized for short notes, similar to X/Twitter",
    kinds: [KIND_NOTE],
  },
  {
    type: "photo",
    typename: "Photoblog",
    description: "Optimized to display pictures and photographs",
    kinds: [KIND_OLAS],
  },
  {
    type: "video",
    typename: "Videoblog",
    description: "Optimized to display video clips and long-form videos",
    kinds: [KIND_VIDEO_VERTICAL, KIND_VIDEO_HORIZONTAL],
  },
  {
    type: "podcast",
    typename: "Podcast",
    description: "Optimized for audio and video podcasts",
    kinds: [KIND_NOTE],
  },
];

export const RECOMMENDED_AUTHORS: TypeAuthor[] = [
  {
    pubkey: "1bd32a386a7be6f688b3dc7c480efc21cd946b43eac14ba4ba7834ac77a23e69",
    type: "note",
    typename: "Microblog",
    kinds: [KIND_NOTE],
  },
  {
    pubkey: "97c70a44366a6535c145b333f973ea86dfdc2d7a99da618c40c64705ad98e322",
    type: "blog",
    typename: "Blog",
    kinds: [KIND_LONG_NOTE],
  },
  {
    pubkey: "7d33ba57d8a6e8869a1f1d5215254597594ac0dbfeb01b690def8c461b82db35",
    type: "photo",
    typename: "Photoblog",
    kinds: [KIND_OLAS],
  },
  {
    pubkey: "47f97d4e0a640c8a963d3fa71d9f0a6aad958afa505fefdedd6d529ef4122ef3",
    type: "video",
    typename: "Videoblog",
    kinds: [KIND_VIDEO_VERTICAL],
  },
  {
    pubkey: "7f573f55d875ce8edc528edf822949fd2ab9f9c65d914a40225663b0a697be07",
    type: "podcast",
    typename: "Podcast",
    kinds: [KIND_NOTE],
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
  CUSTOM_DOMAINS: "custom-domains",
  ICON: "icon",
  IMAGE: "image",
  HASHTAGS: "hashtags",
  KINDS: "kinds",
  ACCENT_COLOR: "accent-color",
  PLUGINS: "plugins",
  APP_NAME: "app-name",
  CONTENT: "content",
  CONTENT_HOMEPAGE: "content-homepage",
  OTHER: "other",
  PINNED_NOTES: "pinned-notes",
  LOGO: "logo",
  NOSTR_JSON: "nostr-json",
};

export const SETTINGS_CONFIG = {
  websiteAddress: {
    title: "Site address",
    anchor: HASH_CONFIG.URL,
    icon: <LinkIcon />,
    group: "General settings",
    description: "",
  },
  customDomains: {
    title: "Custom domains",
    anchor: HASH_CONFIG.CUSTOM_DOMAINS,
    icon: <WebIcon />,
    group: "General settings",
    description: "You do not have custom domains yet.",
  },
  titleDescription: {
    title: "Title & Description",
    anchor: HASH_CONFIG.TITLE_DESCRIPTION,
    icon: <TitleIcon />,
    group: "General settings",
    description: "The details used to identify your publication around the web",
  },
  contributors: {
    title: "Contributors",
    anchor: HASH_CONFIG.CONTRIBUTORS,
    icon: <UserCircleIcon />,
    group: "General settings",
    description: "",
  },
  content: {
    title: "Auto-import of new posts",
    anchor: HASH_CONFIG.CONTENT,
    icon: <FIleTextIcon />,
    group: "General settings",
    description:
      "Enable auto-import to publish new posts of chosen kinds and hashtags by the site contributors",
  },
  plugins: {
    title: "Plugins",
    anchor: HASH_CONFIG.PLUGINS,
    icon: <CodeIcon />,
    group: "General settings",
    description:
      "You can add custom html/css/js code into the header and footer of your site",
  },
  other: {
    title: "Other settings",
    anchor: HASH_CONFIG.OTHER,
    icon: <FIleTextIcon />,
    group: "General settings",
    description: "Other content and plugin settings",
  },
  pinnedContent: {
    title: "Pinned / Featured content",
    anchor: HASH_CONFIG.PINNED_NOTES,
    icon: <PinIcon />,
    group: "General settings",
    description: "Pin some content to prioritize it on your site",
  },
  appName: {
    title: "App name",
    anchor: HASH_CONFIG.APP_NAME,
    icon: <IosSmartphoneIcon />,
    group: "App on homescreen",
    description:
      "Short name for your site, displayed when users add it to homescreen",
  },
  icon: {
    title: "App Icon",
    anchor: HASH_CONFIG.ICON,
    icon: <StarRectangleIcon />,
    group: "App on homescreen",
    description: "Icon of the site when users add it to homescreen",
  },
  theme: {
    title: "Theme",
    anchor: HASH_CONFIG.DESIGN_BRANDING,
    icon: <BrushIcon />,
    group: "Design",
    description: "",
  },
  accentColor: {
    title: "Accent color",
    anchor: HASH_CONFIG.ACCENT_COLOR,
    icon: <PipetteIcon />,
    group: "Design",
    description: "Accent color for theme and PWA",
  },
  logo: {
    title: "Logo",
    anchor: HASH_CONFIG.LOGO,
    icon: <StarIcon />,
    group: "Design",
    description: "Site logo",
  },
  image: {
    title: "Image",
    anchor: HASH_CONFIG.IMAGE,
    icon: <ImageIcon />,
    group: "Design",
    description: "Site cover image",
  },
  navigation: {
    title: "Navigation",
    anchor: HASH_CONFIG.NAVIGATION,
    icon: <NavigationIcon />,
    group: "Design",
    description: "Primary site navigation",
  },
  homepageContent: {
    title: "Homepage content",
    anchor: HASH_CONFIG.CONTENT_HOMEPAGE,
    icon: <HomeIcon />,
    group: "Homepage",
    description:
      "Choose event kinds and hashtags that will be displayed on the homepage",
  },
  nostrJson: {
    title: "Nostr.json",
    anchor: HASH_CONFIG.NOSTR_JSON,
    icon: <JsonCodeIcon />,
    group: "Files",
    description: "Edit your nostr.json file to add NIP-05 records",
  },
  recommendations: {
    title: "Recommendations",
    anchor: HASH_CONFIG.RECOMMENDATION,
    icon: <MessageIcon />,
    group: "Growth",
    description: "",
    isComingSoon: true,
  },
};

export const STEPS_ONBOARDING_CONFIG = {
  start: {
    title: "Start",
    slug: "onboarding",
    step: 1,
  },
  connection: {
    title: "Connection",
    slug: "connection",
    step: 2,
  },
  "create-site": {
    title: "Create site",
    slug: "create-site",
    step: 3,
  },
};

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
  APPS = "apps",
}

export const THEMES_PREVIEW = [
  {
    id: "naddr1qqrxcmmwv3hkuq3qpr4du5xl28dy5sh4msz9uddnwxgzupkk4qzjzklv84edc6ruevzqxpqqqpmnye00ces",
    tag: TYPES_THEMES_TAG.PHOTOGRAPHY,
    name: "London",
    url: "https://malos10-demo.npub.pro",
    preview: londonDemo,
  },
  {
    id: "naddr1qqzxgcthdcpzqz82megd75w6ffp0thqytc6mxuvs9crdd2q9y9d7c0tjm358ejcyqvzqqqrhxgsugqzh",
    tag: TYPES_THEMES_TAG.BLOG,
    name: "Dawn",
    url: "https://hodlbod-demo.npub.pro",
    preview: dawnDemo,
  },
  {
    id: "naddr1qqzhgctnw3jsygqgat09ph63mf9y9awuq30rtvm3jqhqd44gq5s4hmpawtwxslxtqspsgqqqwueqj9k6nd",
    tag: TYPES_THEMES_TAG.RECIPES,
    name: "Taste",
    url: "https://enki-demo.npub.pro",
    preview: tasteDemo,
  },
  {
    id: "naddr1qq9x66trwfhj6un4vfusygqgat09ph63mf9y9awuq30rtvm3jqhqd44gq5s4hmpawtwxslxtqspsgqqqwueq49c2sl",
    tag: TYPES_THEMES_TAG.MICROBLOG,
    name: "Micro-ruby",
    url: "https://m-t-npub-pro.npub.pro/",
    preview: microRubyDemo,
  },
  {
    id: "naddr1qqz8wctkv5pzqz82megd75w6ffp0thqytc6mxuvs9crdd2q9y9d7c0tjm358ejcyqvzqqqrhxg06yarz",
    tag: TYPES_THEMES_TAG.PODCAST,
    name: "Wave",
    url: "https://cd-demo.npub.pro",
    preview: waveDemo,
  },
  {
    id: "naddr1qqxx66trwfhj6umfd4cxc7gzyqyw4hjsmaga5jjz7hwqgh34kdceqtsx665q2g2mas7h9hrg0n9sgqcyqqq8wvsequ5f9",
    tag: TYPES_THEMES_TAG.MICROBLOG,
    name: "Micro-simply",
    url: "https://corndalorian-npub-pro.npub.pro/",
    preview: microSimplyDemo,
  },
  {
    id: "naddr1qqyxc6t9vfkxjmn8qgsq36k72r04rkj2gt6acpz7xkehrypwqmt2spfpt0kr6ukudp7vkpqrqsqqqaej4xaw0c",
    tag: TYPES_THEMES_TAG.BLOG,
    name: "Liebling",
    url: "https://laeserin-npub-pro.npub.pro/",
    preview: lieblingDemo,
  },
  {
    id: "naddr1qqz8yatz0ypzqz82megd75w6ffp0thqytc6mxuvs9crdd2q9y9d7c0tjm358ejcyqvzqqqrhxg05vddj",
    tag: TYPES_THEMES_TAG.MAGAZINE,
    name: "Ruby",
    url: "https://croxroadnews-demo.npub.pro",
    preview: rubyDemo,
  },
  {
    id: "naddr1qqrk5mm4wfhxzmqzyqyw4hjsmaga5jjz7hwqgh34kdceqtsx665q2g2mas7h9hrg0n9sgqcyqqq8wvsh25luq",
    tag: TYPES_THEMES_TAG.BLOG,
    name: "Journal",
    url: "https://fiatjaf-demo.npub.pro",
    preview: journalDemo,
  },
  {
    id: "naddr1qqzx2er8v5pzqz82megd75w6ffp0thqytc6mxuvs9crdd2q9y9d7c0tjm358ejcyqvzqqqrhxg7zn273",
    tag: TYPES_THEMES_TAG.PHOTOGRAPHY,
    name: "Edge",
    url: "https://inkblotart-demo.npub.pro",
    preview: edgeDemo,
  },
  {
    id: "naddr1qqz8xmmvdupzqz82megd75w6ffp0thqytc6mxuvs9crdd2q9y9d7c0tjm358ejcyqvzqqqrhxg3zdu5d",
    tag: TYPES_THEMES_TAG.BLOG,
    name: "Solo",
    url: "https://karnage-demo.npub.pro",
    preview: soloDemo,
  },
  {
    id: "naddr1qqyk6ctnwd5hvetv0ypzqz82megd75w6ffp0thqytc6mxuvs9crdd2q9y9d7c0tjm358ejcyqvzqqqrhxg65mffq",
    tag: TYPES_THEMES_TAG.BLOG,
    name: "Massively",
    url: "https://isolabell-demo.npub.pro",
    preview: massivelyDemo,
  },
  {
    id: "naddr1qqrk2urfwdhkgegzyqyw4hjsmaga5jjz7hwqgh34kdceqtsx665q2g2mas7h9hrg0n9sgqcyqqq8wvs4lzhhz",
    tag: TYPES_THEMES_TAG.PODCAST,
    name: "Episode",
    url: "https://episode-demo.npub.pro",
    preview: episodeDemo,
  },
  {
    id: "naddr1qqrxg6t8v4ehgq3qpr4du5xl28dy5sh4msz9uddnwxgzupkk4qzjzklv84edc6ruevzqxpqqqpmnytfk8l9",
    tag: TYPES_THEMES_TAG.BLOG,
    name: "Digest",
    url: "https://tony-demo.npub.pro",
    preview: digestDemo,
  },
  {
    id: "naddr1qqzhqcthv9usygqgat09ph63mf9y9awuq30rtvm3jqhqd44gq5s4hmpawtwxslxtqspsgqqqwueqavz5au",
    tag: TYPES_THEMES_TAG.PHOTOGRAPHY,
    name: "Paway",
    url: "https://onyx-demo.npub.pro",
    preview: pawayDemo,
  },
  {
    id: "naddr1qqzxzmr5dupzqz82megd75w6ffp0thqytc6mxuvs9crdd2q9y9d7c0tjm358ejcyqvzqqqrhxg3rvw8e",
    tag: TYPES_THEMES_TAG.BLOG,
    name: "Alto",
    url: "https://jackmallers-demo.npub.pro",
    preview: altoDemo,
  },
  {
    id: "naddr1qqrk2erfw35k7mszyqyw4hjsmaga5jjz7hwqgh34kdceqtsx665q2g2mas7h9hrg0n9sgqcyqqq8wvspgnlqu",
    tag: TYPES_THEMES_TAG.BLOG,
    name: "Edition",
    url: "https://alanbwt-demo.npub.pro",
    preview: editionDemo,
  },
  {
    id: "naddr1qqyxyatvd3jhg6twqgsq36k72r04rkj2gt6acpz7xkehrypwqmt2spfpt0kr6ukudp7vkpqrqsqqqaejtrgtuy",
    tag: TYPES_THEMES_TAG.BLOG,
    name: "Bulletin",
    url: "https://rabble-demo.npub.pro",
    preview: bulletinDemo,
  },
  {
    id: "naddr1qqr8x6tdwpk8jq3qpr4du5xl28dy5sh4msz9uddnwxgzupkk4qzjzklv84edc6ruevzqxpqqqpmnyykmacn",
    tag: TYPES_THEMES_TAG.MAGAZINE,
    name: "Simply",
    url: "https://nogood-demo.npub.pro",
    preview: simplyDemo,
  },
  {
    id: "naddr1qqzkv6t60fusygqgat09ph63mf9y9awuq30rtvm3jqhqd44gq5s4hmpawtwxslxtqspsgqqqwueqkvrjjk",
    tag: TYPES_THEMES_TAG.RECIPES,
    name: "Fizzy",
    url: "https://essential-demo.npub.pro",
    preview: fizzyDemo,
  },
  {
    id: "naddr1qqzxgmmsv5pzqz82megd75w6ffp0thqytc6mxuvs9crdd2q9y9d7c0tjm358ejcyqvzqqqrhxgvagq2d",
    tag: TYPES_THEMES_TAG.BLOG,
    name: "Dope",
    url: "https://lectio-demo.npub.pro",
    preview: dopeDemo,
  },
  {
    id: "naddr1qqrxzar5d9kxzq3qpr4du5xl28dy5sh4msz9uddnwxgzupkk4qzjzklv84edc6ruevzqxpqqqpmny6ltg6d",
    tag: TYPES_THEMES_TAG.BLOG,
    name: "Attila",
    url: "https://lynalden-demo.npub.pro",
    preview: attilaDemo,
  },
  {
    id: "naddr1qqyxsetpv3kxjmn9qgsq36k72r04rkj2gt6acpz7xkehrypwqmt2spfpt0kr6ukudp7vkpqrqsqqqaejz34fns",
    tag: TYPES_THEMES_TAG.MAGAZINE,
    name: "Headline",
    url: "https://headline-demo.npub.pro",
    preview: headlineDemo,
  },
  {
    id: "naddr1qqzx2ctnv5pzqz82megd75w6ffp0thqytc6mxuvs9crdd2q9y9d7c0tjm358ejcyqvzqqqrhxg6hz39v",
    tag: TYPES_THEMES_TAG.MAGAZINE,
    name: "Ease",
    url: "https://ease-demo.npub.pro/",
    preview: easeDemo,
  },
  {
    id: "naddr1qqy8xcmjd9c8gmmjqgsq36k72r04rkj2gt6acpz7xkehrypwqmt2spfpt0kr6ukudp7vkpqrqsqqqaejkmdkjl",
    tag: TYPES_THEMES_TAG.BLOG,
    name: "Scriptor",
    url: "https://scriptor-demo.npub.pro/",
    preview: scriptorDemo,
  },
  {
    id: "naddr1qqr8xmm4wf3k2q3qpr4du5xl28dy5sh4msz9uddnwxgzupkk4qzjzklv84edc6ruevzqxpqqqpmnyu8s4qp",
    tag: TYPES_THEMES_TAG.MAGAZINE,
    name: "Source",
    url: "https://source-demo.npub.pro/",
    preview: sourceDemo,
  },
  {
    id: "naddr1qqzx6mnddspzqz82megd75w6ffp0thqytc6mxuvs9crdd2q9y9d7c0tjm358ejcyqvzqqqrhxgtyr0e7",
    tag: TYPES_THEMES_TAG.BLOG,
    name: "MNML",
    url: "https://mnml-demo.npub.pro/",
    preview: mnmlDemo,
  },
  {
    id: "naddr1qqr8v6t5dae8xq3qpr4du5xl28dy5sh4msz9uddnwxgzupkk4qzjzklv84edc6ruevzqxpqqqpmnyf9wg6a",
    tag: TYPES_THEMES_TAG.APPS,
    name: "Vitors",
    url: "https://amethyst-demo.npub.pro/",
    preview: vitorsDemo,
  },
  {
    id: "naddr1qq8x66trwfhj6mrfv43xc6twvupzqz82megd75w6ffp0thqytc6mxuvs9crdd2q9y9d7c0tjm358ejcyqvzqqqrhxglg6mpp",
    tag: TYPES_THEMES_TAG.MICROBLOG,
    name: "Micro-liebling",
    url: "https://intuitive-guy-demo.npub.pro/",
    preview: microLieblingDemo,
  },
];
