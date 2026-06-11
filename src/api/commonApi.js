const RESTCOUNTRIES_URL =
  "https://restcountries.com/v3.1/all?fields=name,cca2,flags";

// Simple in-memory cache to avoid refetching on every form mount
let _countriesCache = null;
let _countriesPromise = null;

export async function fetchCountries() {
  if (_countriesCache) return _countriesCache;

  if (_countriesPromise) return _countriesPromise;

  _countriesPromise = fetch(RESTCOUNTRIES_URL)
    .then((res) => res.json())
    .then((data) => {
      const formattedCountries = (data || [])
        .map((country) => ({
          name: country?.name?.common,
          value: country?.cca2 || country?.name?.common,
          flag: country?.flags?.png,
        }))
        .filter((c) => c.name && c.value)
        .sort((a, b) => a.name.localeCompare(b.name));

      _countriesCache = formattedCountries;
      return formattedCountries;
    })
    .catch((err) => {
      // allow retry after failure
      _countriesPromise = null;
      console.error("Error fetching countries:", err);
      throw err;
    });

  return _countriesPromise;
}

