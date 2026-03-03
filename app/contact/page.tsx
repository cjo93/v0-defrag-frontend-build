"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
  _honeypot: z.string().max(0, {
    message: "Bot detected.",
  }).optional(),
});

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      _honeypot: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setIsSuccess(true);
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-lg bg-black">
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center text-[10px] text-white/50 hover:text-white mb-8 uppercase tracking-widest font-mono transition-colors"
          >
            <ArrowLeft className="mr-2 h-3 w-3" />
            BACK
          </Link>
          <h1 className="text-4xl font-normal uppercase tracking-tight text-white mb-2 font-sans">
            Contact
          </h1>
          <p className="text-sm font-mono text-white/50">
            Send us a message and we&apos;ll get back to you.
          </p>
        </div>

        {isSuccess ? (
          <div className="border border-white/20 p-8 bg-black">
            <h2 className="text-white font-mono text-sm uppercase tracking-wider mb-4">
              Message Received
            </h2>
            <p className="text-white/50 text-sm font-mono mb-8">
              Thank you for reaching out. We will respond to your inquiry shortly.
            </p>
            <Button
              variant="outline"
              className="w-full rounded-none border-white/20 text-white hover:bg-white hover:text-black font-mono uppercase tracking-widest text-xs h-12"
              onClick={() => {
                setIsSuccess(false);
                form.reset();
              }}
            >
              SEND ANOTHER MESSAGE
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Honeypot field (hidden) */}
              <FormField
                control={form.control}
                name="_honeypot"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input {...field} tabIndex={-1} autoComplete="off" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest text-white/50 font-mono block mb-2">
                        NAME
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="YOUR NAME"
                          {...field}
                          className="rounded-none bg-black border-0 border-b border-white/20 text-white focus-visible:ring-0 focus-visible:border-white placeholder:text-white/20 h-10 font-mono text-sm px-0 transition-colors"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 font-mono text-[10px] mt-2 uppercase" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest text-white/50 font-mono block mb-2">
                        EMAIL
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="HELLO@EXAMPLE.COM"
                          {...field}
                          className="rounded-none bg-black border-0 border-b border-white/20 text-white focus-visible:ring-0 focus-visible:border-white placeholder:text-white/20 h-10 font-mono text-sm px-0 transition-colors"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 font-mono text-[10px] mt-2 uppercase" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-widest text-white/50 font-mono block mb-2">
                      MESSAGE
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="HOW CAN WE HELP?"
                        className="rounded-none bg-black border-0 border-b border-white/20 text-white focus-visible:ring-0 focus-visible:border-white placeholder:text-white/20 min-h-[160px] font-mono text-sm px-0 resize-none transition-colors"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 font-mono text-[10px] mt-2 uppercase" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-none bg-white text-black hover:bg-white/90 h-14 font-mono uppercase tracking-widest text-xs mt-4 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    REFLECTING
                  </>
                ) : (
                  "TRANSMIT"
                )}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </main>
  );
}
