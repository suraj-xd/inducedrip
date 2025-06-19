import { Book } from "@/components/21st/book-cover";
import MainPage from "@/components/layout/main-page/page";

export default function Test() {
  return (
    <div className="group flex min-h-[350px] w-full items-center justify-center rounded-lg p-4 relative not-prose">
      <Book
        color="#0f172a"
        cover={
          <img
            src="/diary/book-cover-3.png"
            alt="manga cover"
            className="w-full h-full object-cover"
          />
        }
        backOfCover={
          <img
            src="/diary/book-cover-2.png"
            alt="manga page 1"
            className="w-full h-full object-cover"
          />
        }
        content={
          <img
            src="/diary/book-cover-1.png"
            alt="manga page 2"
            className="w-full h-full object-cover"
          />
        }
      />
    </div>
  );
}
