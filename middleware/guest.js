export default function ({ store, route, redirect }) {
    if (store.state.auth.isLoggedIn) {
        // route.push
        console.log(route);
        return redirect("/");
    }
}