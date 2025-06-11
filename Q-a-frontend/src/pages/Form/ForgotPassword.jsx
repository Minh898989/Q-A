import { useState } from "react";
import { Mail, Lock } from "lucide-react";

export default function ResetPasswordForm() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const res = await fetch("https://api-tdminh-17.onrender.com/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            setMessage(data.message);
        } catch (error) {
            setMessage("Có lỗi xảy ra khi gửi yêu cầu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-black mb-2 flex items-center justify-center gap-2">
                    <Lock className="w-6 h-6 text-blue-600" />
                    Quên Mật Khẩu
                </h2>
                <p className="text-gray-500 text-center mb-6 text-sm">
                    Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Email của bạn"
                            className="w-full px-4 py-4 pl-11 border border-gray-300 rounded-lg text-base leading-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Mail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={20} />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 text-lg rounded-lg font-semibold transition ${isSubmitting
                            ? "bg-gray-400 cursor-not-allowed text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                    >
                        {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu đặt lại"}
                    </button>
                </form>

                {message && (
                    <div className="mt-5 text-center">
                        <p className="text-green-600 font-medium">{message}</p>
                    </div>
                )}
            </div>
        </div>
    );
}