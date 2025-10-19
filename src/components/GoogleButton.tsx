const GoogleButton: React.FC = () => (
    <button
      type="button"
      className="w-full py-3 text-base rounded-full font-semibold bg-white text-[#23244b] shadow-lg flex justify-center items-center gap-2 border mt-2 hover:scale-105 transition"
      onClick={() => { window.location.href="/api/auth/google"; }} // Replace this with your Google auth link
    >
      <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="h-5 w-5 mr-2" />
      Sign in with Google
    </button>
  );
  export default GoogleButton;
  