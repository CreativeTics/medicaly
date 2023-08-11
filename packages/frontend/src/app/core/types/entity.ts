export interface AuditService {
  audit(oldObj: Entity, newObj: Entity): Promise<void>;
}

export interface EntityRepository {
  get(id: string): Promise<Entity>;
  save(entity: Entity): Promise<boolean>;
}

export class Entity {
  repository: EntityRepository;
  doctype: string;

  constructor(doctype: string, repository: EntityRepository) {
    this.doctype = doctype;
    this.repository = repository;
  }

  setValues(values: any) {
    Object.assign(this, values);
  }
}
