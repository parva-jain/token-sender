import { Navbar } from "./components/Navbar";
import { SendTransaction } from "./components/SendTransaction";
import { useAccount } from "wagmi";

function App() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {isConnected && (
        <div className="container h-[calc(100vh-120px)] sm:h-[calc(100vh-60px)] mx-auto my-0 flex items-center justify-center">
          <div className="flex items-center justify-center">
            <SendTransaction />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
