import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import axios from "axios";
import { baseUrl } from "../config/Config";

const SiteSettingsContext = createContext();

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  const refreshSettings = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${baseUrl}/api/site-settings`,
        {
          withCredentials: true,
        }
      );

      setSettings(data.settings || {});
    } catch (error) {
      console.error("Failed to load site settings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        setSettings,
        refreshSettings,
        loading,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);

  if (!context) {
    throw new Error(
      "useSiteSettings must be used inside SiteSettingsProvider"
    );
  }

  return context;
};