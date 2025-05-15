const localStorageData = {
  cookies: [],
  origins: [
    {
      origin: "http://localhost:3000",
      localStorage: [],
    },
  ],
};

const allowedKeys = [
  "token",
  "localUserPubkey",
  "__nostrlogin_nip46",
  "localUserProfile",
  "tokenPubkey",
  "__nostrlogin_accounts",
  "localAuth",
  "__nostrlogin_recent",
  "localUserRelays",
];

for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);

  if (allowedKeys.includes(key)) {
    const value = localStorage.getItem(key);
    localStorageData.origins[0].localStorage.push({
      name: key,
      value,
    });
  }
}

const jsonData = JSON.stringify(localStorageData, null, 2);

const blob = new Blob([jsonData], { type: "application/json" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "user-01.json";
a.click();

URL.revokeObjectURL(url);
