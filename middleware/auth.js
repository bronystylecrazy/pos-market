import qs from 'qs';

export default function ({
  store,
  route,
  redirect
}) {

  if (!store.state.auth.isLoggedIn) {
    // route.push
    return redirect(`/login?${qs.stringify({error_message: "please login to the system first!"})}`);
  }

  try {
    store.dispatch("fetchProfile").then(data => {
      if (store.state.application.setting.console_log)
        console.log("middleware", data);
      if (data.error) {
        return redirect(`/login?${qs.stringify({error_message: "Unauthorized, token expired!"})}`);
      }
    });
  } catch (e) {
    return redirect(`/login?${qs.stringify({error_message: e.message})}`);
  }
}
