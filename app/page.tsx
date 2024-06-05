import { Banner } from "@/components/core/homepage/banner";
import { Button } from "@/components/ui/button";

export default function Home() {
  return <div>
    <section className="hero-pattern h-screen relative py-32">
      <div className="content relative mx-auto px-4 md:px-6 pb-[72px] text-amazon-900">
        <Banner href="https://onchain-summer.devfolio.co/" text="🎖️ Participating in Onchain Summer Buildathon" className="mb-6" />
        <h1 className="max-w-[858px] mx-auto text-center mb-6 text-4xl md:text-6xl font-medium">
          <div>
            Pay with <span className="text-[#635bff]">Stripe</span>
          </div>
          <div>
            Earn on <span className="text-[#0052ff]">Base</span>
          </div>
          <div>
            Rewarded with <span className="text-primary">Strase</span>
          </div>
        </h1>
        <p className="max-w-[858px] mx-auto text-center mb-8 font-medium text-amazon-900">
          Strase is the Shopping , where vendor can integrate with Stripe, and enable there users to earn StraseBucks on Base
          everytime that buy to redeem for USDC, NFTs or Gift Cards
        </p>
        <div className="grid grid-cols-2 max-w-[384px] mx-auto gap-2 md:gap-4">
          <Button className="font-md rounded-full text-base h-12 px-16">
            <span className="whitespace-nowrap">Early Testnet Access</span>
          </Button>

          <Button className="font-md rounded-full text-base h-12 px-16" variant="secondary">
            Integrate with SDK
          </Button>
        </div>
      </div>
    </section>
  </div>
}
