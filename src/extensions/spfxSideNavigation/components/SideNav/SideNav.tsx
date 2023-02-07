import * as React from "react";
import { IconButton } from "office-ui-fabric-react/lib/Button";
import SideNavNode from "./SideNavNode";
import ISideNavItem from "./model/ISideNavItem";
import ISideNavProvider from "./provider/ISideNavProvider";
import SideNavProvider from "./provider/SideNavProvider";
import ISideNavProps from "./ISideNavProps";
import ISideNavState from "./ISideNavState";
import { SearchIcon } from "../../../../assets/SearchIcon";
import { Dialog } from '@fluentui/react';

export default class SideNav extends React.Component<
  ISideNavProps,
  ISideNavState
> {
  private sideNavProvider: ISideNavProvider;

  constructor(props: ISideNavProps) {
    super(props);
    this.state = {
      siteNavItems: [],
      isOpened: true,
      showDialog: false,
      searchText: ''
    };
    window.addEventListener("click", this.handleOutsideClick, true);

  }

  public componentWillMount(): void {
    this.sideNavProvider = new SideNavProvider();
  }

  public componentDidMount(): void {
    this.sideNavProvider
      .getSideNav()
      .then((result: ISideNavItem[]): void => {
        this.setState({
          siteNavItems: result,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    window.addEventListener('resize', (ev) => {
      if (window.innerWidth === 800) {
        this.setState({ isOpened: false })
      }
    })
  }

  public render(): JSX.Element {
    const siteMenuClass: string = this.state.isOpened
      ? "site-menu opened"
      : "site-menu";
    const toggleIconName: string = this.state.isOpened
      ? "DoubleChevronLeft8"
      : "DoubleChevronRight8";
    return (
      <div
        className={`site-menu-panel ms-slideRightIn40 visible-i`}
        style={{
          visibility: "hidden",
        }} /* set to hidden then onces css loads it will be visible */
      >
        <div className={siteMenuClass}>
          <img src={require(this.state.isOpened ? '../../../../assets/logo.png' : '../../../../assets/logomini.png')} style={{ backgroundColor: 'transparent', marginLeft: '14px', marginTop: '14px' }} />
          <button className="search-btn-side" onClick={() => this.setState({ showDialog: true })} style={{ overflow: 'hidden', width: this.state.isOpened ? '' : '30px' }}>
            <SearchIcon isOpen={this.state.isOpened} />{this.state.isOpened ? 'Buscar por...' : ''}
          </button>
          {this.state.siteNavItems.length > 0 &&
            this.state.siteNavItems.map(this.renderSideNavNodes)}
        </div>
        <div className="menu-toggle">
          {
            <IconButton
              className={"site-menu-icon"}
              checked={false}
              iconProps={{
                iconName: toggleIconName
              }}
              title="Toggle Menu"
              ariaLabel="Toggle Menu"
              onClick={this.toggleNav}
            />
          }
        </div>
        {/* Dialog*/}
        <Dialog
          isOpen={this.state.showDialog}
          modalProps={{ className: "dialog-box" }}
          onDismiss={() => this.setState({ showDialog: false })}
          dialogContentProps={{ showCloseButton: false }}>
          <div className="search-Dialog">
            <div className="lateral-search-Dialog">
              <div className="lateral-search-header">FILTRAR BUSCA</div>
              <div className="lateral-search-filters">
                <div className="lateral-search-header-filter">ORDENAR POR</div>
                <label className="checkbox-lateral-search">
                  <input type="radio" name="orderby" className="lateral-search-radio" />
                  Relevância
                </label>
                <label className="checkbox-lateral-search">
                  <input type="radio" name="orderby" className="lateral-search-radio" />
                  Recentes
                </label>
                <label className="checkbox-lateral-search">
                  <input type="radio" name="orderby" className="lateral-search-radio" />
                  A-Z
                </label>
              </div>
            </div>
            <div className="search-dialog-input">
              <SearchIcon isOpen={true} />
              <input
                value={this.state.searchText}
                onChange={(event) => { this.setState({ searchText: event.target.value }) }}
                type="text"
                className="search-dialog-inputbox"
                placeholder="Digite o termo que deseja buscar" />
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
  private handleOutsideClick = (event: any) => {
    if (!this.state.isOpened) {
      return;
    } // if site nav is already closed, abort
    let foundSideNavPanel: boolean = false;
    for (let i: number = 0; i < event.path.length; i++) {
      const node: HTMLElement = event.path[i];
      if (!node.className) {
        continue;
      } // skip if no class name
      if (node.className.toLowerCase().indexOf("site-menu-panel") !== -1) {
        foundSideNavPanel = true;
        break;
      }
    }

    if (!foundSideNavPanel) {
      this.toggleNav(); // if no site menu panel found, close the site menu
    }
  };

  private toggleNav = (): void => {
    document.getElementById('sp-appBar').style.width = !this.state.isOpened ? '260px' : '48px';
    this.setState((state, props) => ({
      isOpened: !state.isOpened,
    }));
  };

  private renderSideNavNodes = (
    siteNavItem: ISideNavItem,
    index: number
  ): JSX.Element => {
    return (
      <SideNavNode
        key={index}
        siteNavItem={siteNavItem}
        navIsOpened={this.state.isOpened}
      />
    );
  };
}
