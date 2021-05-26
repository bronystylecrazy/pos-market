export default function ({
  store,
  route,
  redirect
}) {
  if (!store.state.auth.isLoggedIn) {
    // route.push
    return redirect(`/login?${qs.stringify({error_message: "please login to the system first!"})}`);
  }
  console.log("roles", store.state.auth.user.roles);
  if (!store.state.auth.user.roles.toLowerCase().includes("superadmin")) {
    return redirect(`/`);
  }
}
