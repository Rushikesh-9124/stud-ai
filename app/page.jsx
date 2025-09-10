import HeroSection from "@/components/hero";
import { Card, CardContent } from "@/components/ui/card";
import { features } from "./data/features";
import { howItWorks } from "./data/howItWorks";
import { testimonial } from "./data/testimonial";
import Image from "next/image";
import { faqs } from "./data/faqs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <div>
      <Toaster richColors/>
      <div className="grid-background"></div>
      <HeroSection />
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 ">
            Powerfull Features for Your Career Growth
          </h2>
          <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((item, idx) => (
              <Card
                key={idx}
                className={
                  "border-2 hover:border-primary transition-all duration-300"
                }
              >
                <CardContent
                  className={"pt-6 text-center flex flex-col items-center"}
                >
                  <div className="flex flex-col items-center justify-center">
                    {item.icon}
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-3xl font-bold">50+</h3>
              <p className="text-muted-foreground">Industries Covered</p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-3xl font-bold">1000+</h3>
              <p className="text-muted-foreground">Interview Questions</p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-3xl font-bold">95%+</h3>
              <p className="text-muted-foreground">Success Rate</p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-3xl font-bold">24/7</h3>
              <p className="text-muted-foreground">AI Support</p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works!</h2>
            <p className="text-muted-foreground">
              Four simple steps to accelerate your career growth
            </p>
          </div>
          <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {howItWorks.map((item, idx) => (
              <div
                className="flex flex-col items-center text-center space-y-4"
                key={idx}
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-xl">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 ">
            What Our Users Say
          </h2>
          <div className=" grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonial.map((item, idx) => (
              <Card key={idx} className={"bg-background"}>
                <CardContent className={"pt-6 "}>
                  <div className="">
                    <div className="flex items-center space-x-4">
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <Image
                          className="rounded-full border-2 border-primary/20 object-cover"
                          src={item.image}
                          width={40}
                          height={40}
                          alt={item.author}
                        />
                      </div>
                      <div className="">
                        <p className="font-semibold">{item.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.role}
                        </p>
                        <p className="text-sm text-primary">{item.company}</p>
                      </div>
                    </div>
                    <blockquote>
                      <p className="text-muted-foreground italic relative">
                        <span className="text-primary text-3xl absolute -top-4 -left-2">
                          &quot;
                        </span>
                        {item.quote}
                        <span className="text-primary text-3xl absolute -bottom-4 ">
                          &quot;
                        </span>
                      </p>
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Find answers to common questions about out platform
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            {faqs.map((item, idx) => (
              <Accordion key={idx}  type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full ">
        <div className="mx-auto py-24 gradient rounded-lg">
          <div className="flex flex-col items-center justify-center space-y-4 mx-auto max-w-3xl  text-center">
            <h2 className="text-3xl tracking-tighter font-bold text-primary-foreground sm:text-4xl md:text-5xl">
              Ready to Accelerate Your Career?
            </h2>
            <p className="mx-auto text-primary-foreground/80 md:text-xl max-w-[600px]">
              Join thousands of professionals who are advancing their careers
              with AI-powered guidance.
            </p>
            <Link  href={'/dashboard'} passHref>
            <Button size={'lg'} variant={'secondary'}  className={"h-11 mt-5 animate-bounce"}>
              Start Your Journey Today <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
