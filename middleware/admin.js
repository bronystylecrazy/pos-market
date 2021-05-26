export default function ({
  store,
  route,
  redirect
}) {
  if (!store.state.auth.isLoggedIn) {
    // route.push
    return redirect(`/login?${qs.stringify({error_message: "please login to the system first!"})}`);
  }
  if (!store.state.auth.user.roles.includes("admin")) {
    return redirect(`/`);
  }
}
