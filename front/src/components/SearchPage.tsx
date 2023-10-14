import { Link } from "react-router-dom";
import { Base } from "./Base";
import { Search } from "../App";

export function SearchPage() {
  const search = <Search />;
  const base = (
    <Base
      title="Search"
      user={{ isAuthenticated: true }}
      content={search}
      nav={
        <Link className="nav-item nav-link" id="logout" to="/">
          Log out
        </Link>
      }
    />
  );
  return base;
}
