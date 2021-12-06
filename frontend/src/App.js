import './App.css';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Navigation from './components/shared/Navigation/Navigation';

import Home from './pages/Home/Home';
import Authenticate from './pages/Authenticate/Authenticate';
import Activate from './pages/Activate/Activate';
import Rooms from './pages/Rooms/Rooms';
import Room from './pages/Room/Room'; // single page room
import { useSelector } from 'react-redux';
import Loader from './components/shared/Loader/Loader';

// Custom hooks
import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh';


function App() {
  // call refresh endpoint on page refresh by calling the custom hook
  const { loading } = useLoadingWithRefresh(); // call the hook and this hook is returning a object. Get the key by destructuring it and use it. And If the loading is true it will show the loading component else it will hide the loading component  

  return loading ? ( // If the loading is true then the loading component will be shown else other componnet will be shown.
    <Loader message="Loading Please wait"/>
  ) : (
    <BrowserRouter> {/* Creating Router, BrowserRouter is present in react-router-dom library and we import it here*/} 

      <Navigation />  {/* Since Navigation is kept outside of <Switch> therefore it can be applied to all the pages/routes */}
    
      <Switch> {/* Any Routes inside <Swtch> is for many different pages. Switch terminate the further search if a url is matched. */}
        
        {/* Unprotected area */}
        <GuestRoute path="/" exact> {/* exact will ensure that any routes that comes after / is exact */}
          <Home />
        </GuestRoute>
        <GuestRoute path="/authenticate"> {/* This GuestRoute will act as a middleware for all guest routes and it will authenticate all of them. We will have some checks inside the guest route.*/}
          <Authenticate />
        </GuestRoute>

        <SemiProtectedRoute path="/activate">
          <Activate />
        </SemiProtectedRoute>

        <ProtectedRoute path="/rooms">
          <Rooms />
        </ProtectedRoute>

        <ProtectedRoute path="/room/:id"> {/* From addRoomModal, room will be static but id will be changing dynamically*/}
          <Room />
        </ProtectedRoute>


        {/* <Route path="/authenticate">
          <Authenticate />
        </Route> */}

      </Switch>
    </BrowserRouter> 
  );
}


// guestRoute is also a Route component but here we have te freedom of applying checks here. like the user is loggedIn or not etc. Which section you want to show and where to redirect will be done here. 
const GuestRoute = ({children, ...rest}) => { //object destructuring. All the props passed here will be received in rest.
  const { isAuth } = useSelector((state) => state.auth);
  return (
    <Route {...rest} 
      render = {({location}) => {
        return isAuth ? (// If the user is already logged in then redirect to
          <Redirect to = {
            {
              pathname: '/rooms', // It the user is authenticated then redirect it to rooms else redirect it to children steps(to authenticate) phoneEmail varification. 
              state: {from: location}, // Tells "from" where we are redirecting. We will get the location inside render prop
            }
          }/>
        ) : ( // else part
          children
        )
      }}>
    </Route>
  )
}

// For User is loggedIn but not activated(Full name and profile picture is not uploaded ) then what to do? We want to show the stepAvatar children and 
const SemiProtectedRoute = ({children, ...rest}) => {
  const { user, isAuth } = useSelector((state) => state.auth);

  return (
    <Route {...rest}
      render = {({ location }) =>{
          return (
            !isAuth ? 
            (// If the user is not authenticated then redirect to home page
              <Redirect to = {{
                pathname: '/', // If the user is not logged in then redirect it to home page
                state: {from: location},// From where are we going/redirecting
              }}/>
            ) : isAuth && !user.activated ? // User is loggedIn but not activated(Full name and profile picture is not uploaded ) then what to do? We want to show the stepAvatar children and 
              // In our global state we have user information in which we have a property called activated in which we will keep track that the user is activated or not.
              (children) 
              :  
              <Redirect to = {{// Else usko redirect karo rooms me, jab user authenticated v hai aur activated v hai
                pathname: '/rooms',
                state: {from: location}
              }}/>
            )
      }}
    ></Route>
  )
}

const ProtectedRoute = ({children, ...rest}) => {
  const { user, isAuth } = useSelector((state) => state.auth);
  return (
    <Route {...rest}
      render = {({ location }) =>{
          return (
            !isAuth ? 
            (// If the user is not authenticated then redirect to home page
              <Redirect to = {{
                pathname: '/', // If the user is not logged in then redirect it to home page
                state: {from: location},// From where are we going/redirecting
              }}/>
            ) : isAuth && !user.activated ? (// User is loggedIn but not activated(Full name and profile picture is not uploaded ) then what to do? We want to show the stepAvatar children and 
              <Redirect to = {{//If user is authenticated but not activated then redirect it to where we uploaded the profile picture(/activate)
                pathname: '/activate',
                state: {from: location}
              }}/>
            ) : (
              // If the user is both logged in and activated then show the children which will contain the rooms, profile a/c
              children
            )
          )
      }}
    ></Route>
  )
}


export default App;

// home.module.css: module.css sufix is important cuz react has css modules and all the styles in the css module/file is scoped to that component only when we import home.module.css in home.jsx and it won't disturb other component.
// rafc