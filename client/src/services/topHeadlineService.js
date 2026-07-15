import axios from "axios";
import { baseUrl } from "../config/Config";

/*
|--------------------------------------------------------------------------
| Get Top Headline
|--------------------------------------------------------------------------
*/

export const getTopHeadline = async () => {
  const { data } = await axios.get(
    `${baseUrl}/api/top-headline`
  );

  return data;
};

/*
|--------------------------------------------------------------------------
| Update Top Headline
|--------------------------------------------------------------------------
*/

export const updateTopHeadline = async (headlineData) => {
  const { data } = await axios.put(
    `${baseUrl}/api/top-headline`,
    headlineData
  );

  return data;
};

/*
|--------------------------------------------------------------------------
| Add Headline
|--------------------------------------------------------------------------
*/

export const addHeadline = async (headline) => {
  const { data } = await axios.post(
    `${baseUrl}/api/top-headline`,
    headline
  );

  return data;
};

/*
|--------------------------------------------------------------------------
| Delete Headline
|--------------------------------------------------------------------------
*/

export const deleteHeadline = async (id) => {
  const { data } = await axios.delete(
    `${baseUrl}/api/top-headline/${id}`
  );

  return data;
};

/*
|--------------------------------------------------------------------------
| Toggle Visibility
|--------------------------------------------------------------------------
*/

export const toggleHeadlineVisibility = async (id) => {
  const { data } = await axios.patch(
    `${baseUrl}/api/top-headline/${id}/toggle`
  );

  return data;
};