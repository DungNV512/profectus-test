import React from 'react';
import {Tab, Row, Col, Nav, NavItem} from 'react-bootstrap';

export default class TabContainer extends React.Component {

    constructor(props) {

        super(props);

        const activeKey = props.activeKey || 1
        this.state = {activeKey};

        this.activeKey = this.activeKey.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentWillReceiveProps(nextProps) {

        const activeKey = nextProps.activeKey;
        if (activeKey !== undefined) {

            this.setState({activeKey});
        }
    }

    activeKey(key) {

        if (key !== undefined) {

            this.handleSelect(key);
        } else {

            return this.refs.tabContainer.activeKey;
        }
    }

    handleSelect(selectedKey) {

        this.setState({'activeKey': selectedKey});

        if (this.props.onSelect) {
            this.props.onSelect(selectedKey);
        }
    }

    render() {

        const tabs = this.props.tabs;

        return (
            <Tab.Container id={this.props.id} activeKey={this.state.activeKey} onSelect={this.handleSelect} ref="tabContainer">
                <Row className="clearfix">
                    <Col sm={2} className="tab-headings">
                        <Nav bsStyle="pills" stacked>
                            {
                                tabs.map((item, i) => <NavItem key={`nav-key-${i}`} eventKey={item.eventKey || i+1}>{item.label}</NavItem>)
                            }
                        </Nav>
                    </Col>
                    <Col sm={10} className="tab-content">
                        <Tab.Content animation>
                            {
                                tabs.map((item, i) => <Tab.Pane key={`pane-key-${i}`} eventKey={item.eventKey || i+1}>{item.content}</Tab.Pane>)
                            }
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        );
    }
}
