"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
    <main className="min-h-screen font-sans antialiased flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[560px]">
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center font-mono text-[11px] text-white/50 hover:text-white uppercase tracking-[0.2em] transition-colors duration-200 mb-8"
          >
            <ArrowLeft className="mr-2 h-3 w-3" />
            Back
          </Link>
          <p className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50 mb-3">Get in touch</p>
          <h1 className="text-[26px] md:text-[36px] font-normal tracking-[-0.015em] text-white">
            Contact
          </h1>
        </div>

        {isSuccess ? (
          <div className="border border-white/10 bg-white/[0.02] rounded-sm p-7 md:p-8 space-y-4">
            <h2 className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50">
              Message Received
            </h2>
            <p className="text-[14px] md:text-[16px] text-white/65 leading-relaxed">
              Thank you for reaching out. We will respond to your inquiry shortly.
            </p>
            <button
              className="w-full h-12 border border-white/10 text-white/80 rounded-sm font-mono text-[13px] font-semibold uppercase tracking-[0.08em] hover:text-white hover:border-white/20 transition-all duration-200 mt-4"
              onClick={() => {
                setIsSuccess(false);
                form.reset();
              }}
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 block mb-2">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your name"
                          {...field}
                          className="bg-transparent border border-white/10 rounded-sm text-white text-[14px] focus-visible:ring-0 focus-visible:border-white/30 placeholder:text-white/30 h-12 px-5 transition-colors duration-200"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400/80 font-mono text-[10px] mt-2 uppercase tracking-[0.1em]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 block mb-2">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="hello@example.com"
                          {...field}
                          className="bg-transparent border border-white/10 rounded-sm text-white text-[14px] focus-visible:ring-0 focus-visible:border-white/30 placeholder:text-white/30 h-12 px-5 transition-colors duration-200"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400/80 font-mono text-[10px] mt-2 uppercase tracking-[0.1em]" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 block mb-2">
                      Message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="How can we help?"
                        className="bg-transparent border border-white/10 rounded-sm text-white text-[14px] focus-visible:ring-0 focus-visible:border-white/30 placeholder:text-white/30 min-h-[160px] p-5 resize-none transition-colors duration-200"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400/80 font-mono text-[10px] mt-2 uppercase tracking-[0.1em]" />
                  </FormItem>
                )}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-white text-black rounded-sm font-mono text-[13px] font-semibold uppercase tracking-[0.08em] hover:bg-white/90 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </Form>
        )}
      </div>
    </main>
  );
}
