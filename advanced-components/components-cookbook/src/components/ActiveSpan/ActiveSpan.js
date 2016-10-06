import styles from './ActiveSpan';

const ActiveSpan = function(props) {
  let classNames = [props.className];
  classNames = props.active ? classNames.concat(props.activeClass) : classNames;
  return (
    <span onClick={props.onClick} className={classNames.join(' ')}>
      {props.label}
    </span>
  );
};


export default ActiveSpan;
