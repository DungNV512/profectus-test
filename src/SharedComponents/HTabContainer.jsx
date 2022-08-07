import React from 'react';
import {Tab, Row, Col, Nav, NavItem} from 'react-bootstrap';

export default class HTabContainer extends React.Component {

    constructor(props) {

        super(props);
        this.onSelect = this.onSelect.bind(this);
        this.state = {};
    }

    componentDidMount() {

        let activeKey = 1;
        if (this.props.activeKey) {

            activeKey = this.props.activeKey;
        }
        this.setState({activeKey});
    }

    activeKey() {

        if (arguments.length > 0) {

            const activeKey = arguments[0];
            this.onSelect(activeKey);

        } else {

            return this.refs.tabContainer.activeKey;
        }
    }

    onSelect(selectedKey) {

        this.setState({'activeKey': selectedKey});
        if (this.props.onSelect) {

            this.props.onSelect(selectedKey);
        }

    }

    render() {

        const tabs = this.props.tabs;
        return (
            <Tab.Container id={this.props.id} className="horizontal-tab-container" activeKey={this.state.activeKey} onSelect={this.onSelect} ref="tabContainer">
                <Row className="clearfix">
                    <Col sm={12}>
                        <Nav bsStyle="tabs">
                            {
                                tabs.map((item, i) => {
                                    let eventKey = i + 1;
                                    if (item.eventKey) {
                                        eventKey = item.eventKey;
                                    }

                                    const disabled = (item.disabled === true);

                                    return (
                                        <NavItem key={`nav-key-${i}`} eventKey={eventKey} disabled={disabled}>{item.label}</NavItem>
                                    );
                                })
                            }
                        </Nav>
                    </Col>
                    <Col sm={12}>
                        <Tab.Content animation>
                            {
                                tabs.map((item, i) => {
                                    let eventKey = i + 1;
                                    if (item.eventKey) {
                                        eventKey = item.eventKey;
                                    }

                                    return (
                                        <Tab.Pane key={`pane-key-${i}`} eventKey={eventKey}>{item.content}</Tab.Pane>
                                    );
                                })
                            }
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        );
    }
}
