import React from "react";
import PropTypes from "prop-types";
import { formatPrice } from "../helpers";
import { TransitionGroup, CSSTransition } from "react-transition-group";

class Order extends React.Component {
	static propTypes = {
		fishes: PropTypes.objectOf(
			PropTypes.shape({
				image: PropTypes.string,
				name: PropTypes.string,
				desc: PropTypes.string,
				status: PropTypes.string,
				price: PropTypes.number,
			})
		),
		order: PropTypes.objectOf(PropTypes.number),
		decreaseCount: PropTypes.func,
		increaseCount: PropTypes.func,
	};
	renderOrder = (key) => {
		const fish = this.props.fishes[key];
		const count = this.props.order[key];
		const isAvailable = fish && fish.status === "available";
		const transitionOptions = {
			classNames: "order",
			key,
			timeout: { enter: 250, exit: 250 },
		};
		if (!fish) {
			return null;
		}
		if (!isAvailable) {
			return (
				<CSSTransition {...transitionOptions}>
					<li key={key}>{fish ? fish.name : "fish"} is no longer available</li>
				</CSSTransition>
			);
		}
		return (
			<CSSTransition {...transitionOptions}>
				<li key={key}>
					<span>
						<TransitionGroup component="span" className="count">
							<CSSTransition
								classNames="count"
								key={count}
								timeout={{ enter: 500, exit: 500 }}
							>
								<span>{count}</span>
							</CSSTransition>
						</TransitionGroup>
						lbs {fish.name}
						{formatPrice(count * fish.price)}
						<button onClick={() => this.props.decreaseCount(key)}>-</button>
						<button onClick={() => this.props.increaseCount(key)}>+</button>
					</span>
				</li>
			</CSSTransition>
		);
	};
	render() {
		const orderIds = Object.keys(this.props.order);
		const total = orderIds.reduce((prevTotal, key) => {
			const fish = this.props.fishes[key];
			const count = this.props.order[key];
			const isAvailable = fish && fish.status === "available";
			if (isAvailable) {
				return prevTotal + count * fish.price;
			} else {
				return prevTotal;
			}
		}, 0);
		return (
			<div className="order-wrap">
				<h2>Order</h2>
				<TransitionGroup component="ul" className="order">
					{orderIds.map(this.renderOrder)}
				</TransitionGroup>
				<div className="total">
					<strong>Total:{formatPrice(total)}</strong>
				</div>
			</div>
		);
	}
}

export default Order;
