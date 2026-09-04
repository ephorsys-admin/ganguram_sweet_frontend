import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import TopBar from "../admin/admin-components/TopBar";
import SideBar from "../admin/admin-components/SideBar";
import { useSocket } from "../context/socket";
import { useToast } from "../context/ToastContext";

const playNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playTone = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Play a premium sweet double-chime (A5 -> C6)
    playTone(880, ctx.currentTime, 0.4);
    playTone(1046.5, ctx.currentTime + 0.12, 0.5);
  } catch (e) {
    console.error("Failed to play notification sound:", e);
  }
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const socket = useSocket();
  const { showToast } = useToast();

  useEffect(() => {
    if (!socket) return;

    socket.on("new_order", (data) => {
      playNotificationSound();
      showToast(
        `🛍️ New Order Received! placed by ${
          data.customerName || "Customer"
        } - Total: ₹${data.totalAmount}`,
        "info"
      );
    });

    socket.on("new_contact", (data) => {
      playNotificationSound();
      showToast(
        `✉️ New Inquiry Received! from ${data.name || "Visitor"} (${
          data.email || ""
        })`,
        "info"
      );
    });

    return () => {
      socket.off("new_order");
      socket.off("new_contact");
    };
  }, [socket, showToast]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAF6F0]/40">
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
        <TopBar setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 min-w-0 w-full p-3.5 sm:p-5 md:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;