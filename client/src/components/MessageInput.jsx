import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Loader2, Send, X } from "lucide-react";
import toast from "react-hot-toast";

function MessageInput() {
  const [text, setText] = useState("");
  const [image, setImage] = useState();
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();
  const [isSending, setIsSending] = useState(false);

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    try {
      setIsSending(true);
      await sendMessage({ text: text.trim(), image: imagePreview });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  }

  function removeImage() {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
  }

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative w-20 h-20">
            {/* Image Preview */}
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg border border-zinc-700"
            />

            {/* Spinner in Center When Sending */}
            {isSending && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                <Loader2 className="size-6 text-white animate-spin" />
              </div>
            )}

            {/* Remove Button */}
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
              disabled={isSending} // Disable remove while sending
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={15} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle cursor-pointer"
          disabled={(!text.trim() && !imagePreview) || isSending}
        >
          <Send size={12} />
        </button>
      </form>
    </div>
  );
}

export default MessageInput;
