import LogoManager from "./LogoManager";
import BreakingNewsManager from "./BreakingNewsManager";
import TopHeadlineManager from "./TopHeadlineManager";
import NavbarManager from "./NavbarManager";
import BannerManager from "./BannerManager";
import FooterManager from "./FooterManager";
import SocialLinksManager from "./SocialLinksManager";
import ContactManager from "./ContactManager";

const managerComponents = {
  logo: LogoManager,
  breakingNews: BreakingNewsManager,
  topHeadline: TopHeadlineManager,
  navbar: NavbarManager,
  banner: BannerManager,
  footer: FooterManager,
  socialLinks: SocialLinksManager,
  contact: ContactManager,
};

export default managerComponents;