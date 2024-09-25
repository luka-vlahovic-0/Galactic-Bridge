import Image from "next/image";
import githubImg from "../../public/assets/githublogo.png";
import linkedInImg from "../../public/assets/linkedinlogo.png";

export default function Footer() {
  return (
    <div className="w-full h-14 bg-transparent flex justify-center items-center p-2 mt-28 z-50">
      <p className="text-white font-semibold mr-5 text-xs p-2 sm:text-sm md:text-base">
        © 2024. Made by Luka Vlahovic, All rights reserved.
      </p>
      <div className="flex space-x-4 p-2 relative z-50">
      <a
            href="https://www.linkedin.com/in/luka-vlahovic-657162281/"
            className="md:text-2xl text-xl hover:scale-125 duration-300"
            target="_blank"
          >
            <Image src={linkedInImg} alt="LinkedIn Logo" className="h-10 w-10" unoptimized/>
          </a>
          <a
            href="https://github.com/luka-vlahovic-0"
            className="md:text-2xl text-xl hover:scale-125 duration-300"
            target="_blank"
          >
            <Image src={githubImg} alt="GitHub Logo" className="h-8 w-8 mt-1" unoptimized/>
          </a>
      </div>
    </div>
  );
}
