import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import ChangePassword from "../components/ChangePassword";

function Profile() {
  const { user } = useContext(UserContext);

  if (!user)
    return <div className="text-center mt-10">No has iniciado sesión.</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-black mb-4">Mi Perfil</h2>
      <div className="mb-6">
        <p>
          <span className="font-semibold text-black">Usuario:</span>{" "}
          <span className="text-black">{user.username || user.email}</span>
        </p>
        <p>
          <span className="font-semibold text-black">Email:</span>{" "}
          <span className="text-black">{user.email}</span>
        </p>
        {/* Puedes añadir más datos aquí si los tienes */}
      </div>
      <ChangePassword />
    </div>
  );
}

export default Profile;
