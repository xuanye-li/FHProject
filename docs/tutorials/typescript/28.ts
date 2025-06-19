type Point = {
    x: number;
    y: number;
};

type PartialPoint = Partial<Point>;

// Solution: Define CompletePoint using Required on PartialPoint
type CompletePoint = Required<PartialPoint>;

const point: CompletePoint = {x: 10};