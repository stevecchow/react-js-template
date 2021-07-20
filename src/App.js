import "./App.css";
import { AppRoutes } from "./routes";
import { HashRouter as Router } from "react-router-dom";
import routes from "@/routes/router.config";
// import postmessage from "@/utils/postmessage";

function App() {
  return (
    <div className="App">
      <Router>
        <AppRoutes routes={routes} />
      </Router>
    </div>
  );
}

export default App;
