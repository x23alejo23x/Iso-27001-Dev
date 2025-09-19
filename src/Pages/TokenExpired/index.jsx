import { urlAutentication } from "../../Server";
import imageMasorange from "../../assets/+O/+O-White.png";
import token from "../../assets/svg/token.svg";

const styles = `
@layer components {
  .card-container {
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    z-index: 10;
  }

  .custom-button {
    padding: 12px 24px;
    text-transform: uppercase;
    border-radius: 8px;
    font-size: 18px;
    font-weight: 500;
    color: #f16e00;
    background: #f16e00;
    cursor: pointer;
    transition: 0.5s ease;
    user-select: none;
  }

  .custom-button:hover,
  .custom-button:focus {
    color: #000000;
    background: #d3d3d3;
    border: 1px solid #f16e00;
    box-shadow: 0 0 5px #B0B0B0, 0 0 20px #f16e00;
  }

  html, body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    height: 100%;
  }
}
`;

const TokenExpired = () => {
  return (
    <>
      <style>{styles}</style>
      <div
        className="h-screen w-screen relative flex items-center justify-center flex-col overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${token})` }}
      >
        <img
          src={imageMasorange}
          className="absolute start-4 top-6 h-16 w-32"
        />
        <div className="bg-slate-600 bg-opacity-20 p-8 rounded-2xl shadow-lg z-10 text-center text-white">
          <h1 className="text-4xl font-bold">Token caducado</h1>
          <p className="mt-4 text-xl">
            Vuelve a iniciar sesión para acceder a Iceberg.
          </p>
          <a
            href={urlAutentication}
            className="custom-button inline-block mt-8 px-6 py-3 text-lg text-black"
          >
            Iniciar Sesión
          </a>
        </div>
      </div>
    </>
  );
};

export default TokenExpired;
