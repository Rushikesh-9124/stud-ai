import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import {
  ChevronDown,
  FileText,
  GraduationCap,
  LayoutDashboard,
  PenBox,
  StarsIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { checkUser } from "@/lib/checkUser";

const Header = async() => {
  await checkUser()
  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto py-4 h-16 flex items-center justify-between">
        <Link href="/">
          <Image
            src={"/stud-ai.png"}
            alt="Logo"
            width={200}
            height={60}
            className="h-12 py-1 w-auto object-contain"
          />
        </Link>
        <div className="flex space-x-2 items-center md:space-x-4">
          <SignedIn>
            <Link href="/dashboard" prefetch>
              <Button className="cursor-pointer" variant={"outline"}>
                <LayoutDashboard className="h-4  w-4" />
                <p className="hidden md:block">Industry Insights</p>
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="cursor-pointer">
                  <StarsIcon className="h-4 w-4" />
                  <p className="hidden md:block">Growth Tools</p>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/resume" prefetch className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Create Resume</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Link
                    href="/ai-cover-letter"
                    className="flex items-center gap-2"
                    prefetch
                  >
                    <PenBox className="h-4 w-4" />
                    <span>Cover Letter</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Link href="/interview" prefetch className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>Interview Prep</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button className="cursor-pointer">Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/"/>
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
