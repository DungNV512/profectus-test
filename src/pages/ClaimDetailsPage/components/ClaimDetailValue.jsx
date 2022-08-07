import React from 'react';
import PropTypes from 'prop-types';

export default class ClaimDetailValue extends React.PureComponent {

    static get propTypes() {

        return {
            label: PropTypes.string.isRequired,
            children: PropTypes.object
        };
    }

    static get defaultProps() {

        return {
            label: '',
            children: null
        };
    }

    render() {

        return (

            <div className="form-group">
                <div className="col-md-5 control-label">{this.props.label}</div>
                <div className="col-md-7 form-control-static">
                    {this.props.children}
                </div>
            </div>
        );

    }

}
