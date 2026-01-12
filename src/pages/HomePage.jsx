import { useQuery } from "@tanstack/react-query";
import FAQ from "../components/FAQ";
import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import Newsletter from "../components/NewsLetter";
import Services from "../components/Services";
import TestimonialCarousel from "../components/TestimonialCarousel";
import WhyJoin from "../components/WhyJoin";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Blogs from "./Blogs";
import Clubs from "./Clubs";
import Events from "./Events";

const HomePage = () => {
  const axiosSecure = useAxiosSecure();

  const { data: sliderItems = [], isLoading } = useQuery({
    queryKey: ["homeHeroData"],
    queryFn: async () => {
      const [clubsRes, eventsRes] = await Promise.all([
        axiosSecure.get("/clubs?status=approved"),
        axiosSecure.get("/events?status=approved"),
      ]);

      // normalize data
      const clubs = clubsRes.data.map((club) => ({
        _id: club._id,
        type: "club",
        title: club.clubName,
        subtitle: club.description,
        image: club.bannerImage,
        location: club.location,
        updatedAt: club.updatedAt,
      }));

      const events = eventsRes.data.map((event) => ({
        _id: event._id,
        type: "event",
        title: event.eventName,
        subtitle: event.eventDescription,
        image: event.eventBanner,
        location: event.location,
        date: event.eventDate,
        updatedAt: event.updatedAt,
      }));

      return [...clubs.slice(0, 5), ...events.slice(0, 5)];
    },
  });

  return (
    <div>
      {/* <HeroSection /> */}
      {!isLoading && <HeroSection items={sliderItems} />}
      <Clubs variant="home" />
      <Events variant="home" />
      <TestimonialCarousel />
      <Services />
      <Blogs />
      <HowItWorks />
      <WhyJoin />
      <Newsletter />
      <FAQ />
    </div>
  );
};

export default HomePage;
