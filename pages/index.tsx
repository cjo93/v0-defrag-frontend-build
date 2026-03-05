import Nav from '../components/Nav';
import Hero from '../components/Hero';
import TrustChips from '../components/TrustChips';
import RelationshipMapPanel from '../components/RelationshipMapPanel';
import DemoConsole from '../components/DemoConsole';
import HowItWorks from '../components/HowItWorks';
import Pricing from '../components/Pricing';
import PrivacyPanel from '../components/PrivacyPanel';
import FinalCTA from '../components/FinalCTA';

export default function Landing() {
  return (
    <div className="bg-0 text-0 min-h-screen">
      <Nav />
      <Hero />
      <TrustChips />
      <RelationshipMapPanel />
      <DemoConsole />
      <HowItWorks />
      <Pricing />
      <PrivacyPanel />
      <FinalCTA />
    </div>
  );
}
