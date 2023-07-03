export const Test =
    (): MethodDecorator =>
    (target: object, key: string | symbol, descriptor: PropertyDescriptor) => {
        // console.log('test');
        // console.log(Reflect.getMetadata('design:type', target, key));
    };
