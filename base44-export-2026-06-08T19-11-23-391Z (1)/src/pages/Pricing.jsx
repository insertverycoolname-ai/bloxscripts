import React from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Rocket, X } from "lucide-react";
import BlockyCard from "@/components/ui-custom/BlockyCard";
import BlockyButton from "@/components/ui-custom/BlockyButton";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for trying out AI scripting",
    icon: Zap,
    color: "primary",
    borderColor: "border-primary/30",
    glow: "glow-green",
    features: [
      { text: "5 script generations per day", included: true },
      { text: "Basic Luau generation", included: true },
      { text: "Script history (last 10)", included: true },
      { text: "Copy & download scripts", included: true },
      { text: "Script validation", included: false },
      { text: "Auto-polish feature", included: false },
      { text: "Version control", included: false },
      { text: "Priority generation", included: false },
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For serious Roblox developers",
    icon: Crown,
    color: "secondary",
    borderColor: "border-secondary/50",
    glow: "glow-blue",
    features: [
      { text: "50 script generations per day", included: true },
      { text: "Advanced Luau generation", included: true },
      { text: "Unlimited script history", included: true },
      { text: "Copy & download scripts", included: true },
      { text: "Script validation", included: true },
      { text: "Auto-polish feature", included: true },
      { text: "Version control (5 versions)", included: true },
      { text: "Priority generation", included: false },
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Studio",
    price: "$24",
    period: "/month",
    description: "For teams and power users",
    icon: Rocket,
    color: "accent",
    borderColor: "border-accent/50",
    glow: "glow-orange",
    features: [
      { text: "Unlimited generations", included: true },
      { text: "Premium AI model access", included: true },
      { text: "Unlimited script history", included: true },
      { text: "Copy & download scripts", included: true },
      { text: "Script validation", included: true },
      { text: "Auto-polish feature", included: true },
      { text: "Unlimited version control", included: true },
      { text: "Priority generation", included: true },
    ],
    cta: "Go Studio",
    popular: false,
  },
];

const faqs = [
  {
    q: "What scripting language do you support?",
    a: "All scripts are generated in Luau, Roblox's official scripting language. We support Server Scripts, LocalScripts, and ModuleScripts.",
  },
  {
    q: "Can I use generated scripts in my Roblox game?",
    a: "Absolutely! All generated scripts are yours to use in any Roblox game. Just copy them into Roblox Studio.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "The Starter plan is free forever. You can upgrade anytime and cancel within 7 days for a full refund.",
  },
  {
    q: "What happens to my scripts if I downgrade?",
    a: "Your scripts are always saved. On the free plan, you can still view all scripts but only access the most recent 10 in history.",
  },
];

export default function Pricing() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 border-2 border-accent/30 bg-accent/10 mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">Pricing</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black font-heading mb-4">
          LEVEL UP YOUR <span className="text-primary">SCRIPTING</span>
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Choose the plan that fits your Roblox development workflow. Upgrade or downgrade anytime.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div
              className={`relative border-2 ${plan.borderColor} bg-card p-6 h-full flex flex-col ${plan.glow} ${
                plan.popular ? "ring-2 ring-secondary" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 bg-secondary text-secondary-foreground text-[10px] font-black uppercase tracking-widest">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <plan.icon className={`w-6 h-6 text-${plan.color}`} />
                  <h3 className="text-lg font-black uppercase">{plan.name}</h3>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-xs text-muted-foreground">{plan.description}</p>
              </div>

              <div className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-2 text-sm">
                    {f.included ? (
                      <Check className={`w-4 h-4 text-${plan.color} shrink-0`} />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                    )}
                    <span className={f.included ? "" : "text-muted-foreground/50"}>{f.text}</span>
                  </div>
                ))}
              </div>

              <Link to="/generate">
                <BlockyButton
                  variant={plan.popular ? "secondary" : "outline"}
                  className="w-full"
                >
                  {plan.cta}
                </BlockyButton>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-black font-heading text-center mb-8">
          FREQUENTLY <span className="text-secondary">ASKED</span>
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <BlockyCard key={i} animate={false}>
              <h4 className="font-bold text-sm mb-1">{faq.q}</h4>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </BlockyCard>
          ))}
        </div>
      </div>
    </div>
  );
}