import { store, HTTP } from "./store";

export const getMe = async (token: string) => {
  if (store.user !== null) {
    return store.user;
  }
  try {
    const res = await HTTP.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    return res.data;
    console.log(res.data);
  } catch (error) {
    return null;
  }
}

export const getChurch = async (token: string) => {
  if (store.church !== null) {
    return store.church;
  }

  let user = await getMe(token);
  try {
    const res = await HTTP.get(`/churches/${user.church_id.$oid}`, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    store.church = res.data;
    return res.data;
  } catch (error) {
    return null;
  }
};

export const getMembers = async (token: string) => {
  let church = await getChurch(token);
  try {
    const res = await HTTP.get(
      `/members/church/${church._id.$oid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    store.members = res.data;
    console.log(store.members);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch members:", error);
    return [];
  }
};


